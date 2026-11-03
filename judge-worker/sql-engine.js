/**
 * High-Performance In-Memory SQL Execution Engine for CodeJudge
 * Powered by Node.js built-in DatabaseSync (SQLite C-Engine)
 * 
 * Supports:
 * - PostgreSQL, MySQL, and ANSI SQL syntax
 * - CREATE DATABASE / USE database
 * - DDL: CREATE TABLE, DROP TABLE, ALTER TABLE, constraints (CHECK, PRIMARY KEY, FOREIGN KEY)
 * - DML: INSERT, UPDATE, DELETE, TRUNCATE
 * - Queries: SELECT, JOINs, GROUP BY, ORDER BY, Subqueries, CTEs, Window functions
 * - Inspection: SHOW TABLES, DESCRIBE / DESC <table>
 * - Output formatting: Formats query results into clean MySQL/psql style ASCII tables
 */

import { DatabaseSync } from 'node:sqlite';

/**
 * Splits raw SQL script into clean individual executable statements.
 * Preserves semicolons inside quotes and strips single-line & multi-line comments.
 */
export function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (ch === '-' && next === '-' && !inSingleQuote && !inDoubleQuote) {
      inLineComment = true;
      i++;
      continue;
    }
    if (ch === '/' && next === '*' && !inSingleQuote && !inDoubleQuote) {
      inBlockComment = true;
      i++;
      continue;
    }

    if (ch === "'" && !inDoubleQuote) {
      if (inSingleQuote && next === "'") {
        current += "''";
        i++;
        continue;
      }
      inSingleQuote = !inSingleQuote;
      current += ch;
      continue;
    }

    if (ch === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      current += ch;
      continue;
    }

    if (ch === ';' && !inSingleQuote && !inDoubleQuote) {
      const trimmed = current.trim();
      if (trimmed) statements.push(trimmed);
      current = '';
    } else {
      current += ch;
    }
  }

  const remaining = current.trim();
  if (remaining) statements.push(remaining);
  return statements;
}

/**
 * Formats array of objects into a standard MySQL / psql ASCII grid table.
 */
export function formatAsciiTable(rows, title = null) {
  if (!rows || rows.length === 0) {
    return 'Empty set (0.00 sec)';
  }

  const headers = Object.keys(rows[0]);
  if (headers.length === 0) {
    return 'Empty set (0.00 sec)';
  }

  const colWidths = {};
  headers.forEach(h => {
    colWidths[h] = Math.max(h.length, 3);
  });

  rows.forEach(r => {
    headers.forEach(h => {
      const valStr = r[h] !== null && r[h] !== undefined ? String(r[h]) : 'NULL';
      colWidths[h] = Math.max(colWidths[h], valStr.length);
    });
  });

  const border = '+' + headers.map(h => '-'.repeat(colWidths[h] + 2)).join('+') + '+';
  const headerRow = '|' + headers.map(h => ' ' + h.padEnd(colWidths[h]) + ' ').join('|') + '|';
  const dataRows = rows.map(r => {
    return '|' + headers.map(h => {
      const valStr = r[h] !== null && r[h] !== undefined ? String(r[h]) : 'NULL';
      return ' ' + valStr.padEnd(colWidths[h]) + ' ';
    }).join('|') + '|';
  });

  const lines = [];
  if (title) lines.push(title);
  lines.push(border, headerRow, border, ...dataRows, border);
  lines.push(`${rows.length} row${rows.length === 1 ? '' : 's'} in set (0.00 sec)`);
  return lines.join('\n');
}

/**
 * Normalizes SQL dialect specifics (MySQL/Postgres to SQLite)
 */
function cleanSqlDialect(stmt) {
  let cleaned = stmt
    // Strip MySQL engine/charset specifications
    .replace(/ENGINE\s*=\s*[A-Za-z0-9_]+/gi, '')
    .replace(/DEFAULT\s+CHARSET\s*=\s*[A-Za-z0-9_]+/gi, '')
    .replace(/COLLATE\s*=\s*[A-Za-z0-9_]+/gi, '')
    // AUTO_INCREMENT -> AUTOINCREMENT (SQLite requirement)
    .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT')
    // TRUNCATE TABLE <table> -> DELETE FROM <table>
    .replace(/^TRUNCATE\s+TABLE\s+(.+)$/i, 'DELETE FROM $1');

  // Convert double-quoted string literals in VALUES clauses: VALUES (1, "Dustin") -> VALUES (1, 'Dustin')
  cleaned = cleaned.replace(/VALUES\s*\(([^)]+)\)/gi, (match, inner) => {
    const converted = inner.replace(/"([^"]*)"/g, "'$1'");
    return `VALUES (${converted})`;
  });

  // Convert double-quoted values in comparisons: = "something", != "something", LIKE "something"
  cleaned = cleaned.replace(/(=|!=|<>|LIKE)\s*"([^"]*)"/gi, "$1 '$2'");

  return cleaned.trim();
}

/**
 * Executes a full interactive SQL session and returns detailed terminal output.
 */
export async function executeSqlSession(sourceCode, dialect = 'SQL') {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec('PRAGMA foreign_keys = ON;');
  } catch {}

  const statements = splitSqlStatements(sourceCode);
  const outputs = [];
  let activeDatabase = 'default_db';
  let hasSelectQuery = false;
  let createdTablesCount = 0;

  if (statements.length === 0) {
    return {
      success: true,
      stdout: 'Query OK, 0 statements executed.\nEmpty SQL session.',
      stderr: null,
      runtimeMs: 1
    };
  }

  const startTime = Date.now();

  for (let i = 0; i < statements.length; i++) {
    const rawStmt = statements[i];
    const upper = rawStmt.toUpperCase().trim();

    try {
      // 1. CREATE DATABASE
      const createDbMatch = rawStmt.match(/^CREATE\s+DATABASE\s+(?:IF\s+NOT\s+EXISTS\s+)?([`"']?[a-zA-Z0-9_]+[`"']?)/i);
      if (createDbMatch) {
        const dbName = createDbMatch[1].replace(/[`"']/g, '');
        activeDatabase = dbName;
        outputs.push(`Query OK, 1 row affected (0.00 sec)\nDatabase '${dbName}' created successfully.`);
        continue;
      }

      // 2. USE DATABASE
      const useDbMatch = rawStmt.match(/^USE\s+([`"']?[a-zA-Z0-9_]+[`"']?)/i);
      if (useDbMatch) {
        const dbName = useDbMatch[1].replace(/[`"']/g, '');
        activeDatabase = dbName;
        outputs.push(`Database changed to '${dbName}'.`);
        continue;
      }

      // 3. SHOW TABLES / \dt
      if (/^SHOW\s+TABLES/i.test(rawStmt) || /^\\dt/i.test(rawStmt)) {
        const tables = db.prepare("SELECT name AS 'Tables_in_" + activeDatabase + "' FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
        outputs.push(formatAsciiTable(tables));
        continue;
      }

      // 4. DESCRIBE / DESC <table>
      const descMatch = rawStmt.match(/^(?:DESCRIBE|DESC)\s+([`"']?[a-zA-Z0-9_]+[`"']?)/i);
      if (descMatch) {
        const tblName = descMatch[1].replace(/[`"']/g, '');
        const colInfo = db.prepare(`PRAGMA table_info(${tblName})`).all();
        if (colInfo.length === 0) {
          outputs.push(`ERROR 1146 (42S02): Table '${activeDatabase}.${tblName}' doesn't exist`);
        } else {
          const descRows = colInfo.map(c => ({
            Field: c.name,
            Type: c.type || 'TEXT',
            Null: c.notnull === 1 ? 'NO' : 'YES',
            Key: c.pk === 1 ? 'PRI' : '',
            Default: c.dflt_value !== null ? String(c.dflt_value) : 'NULL'
          }));
          outputs.push(formatAsciiTable(descRows, `Table: ${tblName}`));
        }
        continue;
      }

      // 5. SELECT Query
      if (/^(?:SELECT|WITH)/i.test(upper)) {
        hasSelectQuery = true;
        const cleaned = cleanSqlDialect(rawStmt);
        const rows = db.prepare(cleaned).all();
        outputs.push(formatAsciiTable(rows));
        continue;
      }

      // 6. CREATE TABLE
      const createTableMatch = rawStmt.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([`"']?[a-zA-Z0-9_]+[`"']?)/i);
      if (createTableMatch) {
        const tableName = createTableMatch[1].replace(/[`"']/g, '');
        const cleaned = cleanSqlDialect(rawStmt);
        db.exec(cleaned);
        createdTablesCount++;

        const cols = db.prepare(`PRAGMA table_info(${tableName})`).all();
        const colList = cols.map(c => c.name).join(', ');
        outputs.push(`Query OK, 0 rows affected (0.01 sec)\nTable '${tableName}' created successfully with ${cols.length} column(s): (${colList}).`);
        continue;
      }

      // 7. INSERT INTO
      if (/^INSERT\s+INTO/i.test(upper)) {
        const cleaned = cleanSqlDialect(rawStmt);
        db.exec(cleaned);
        outputs.push(`Query OK, 1 or more row(s) inserted successfully (0.01 sec).`);
        continue;
      }

      // 8. UPDATE
      if (/^UPDATE\s+/i.test(upper)) {
        const cleaned = cleanSqlDialect(rawStmt);
        db.exec(cleaned);
        outputs.push(`Query OK, record(s) updated successfully (0.01 sec).`);
        continue;
      }

      // 9. DELETE
      if (/^DELETE\s+FROM/i.test(upper)) {
        const cleaned = cleanSqlDialect(rawStmt);
        db.exec(cleaned);
        outputs.push(`Query OK, record(s) deleted successfully (0.01 sec).`);
        continue;
      }

      // 10. General DDL / DML fallback (DROP, ALTER, CREATE INDEX, etc.)
      const cleaned = cleanSqlDialect(rawStmt);
      db.exec(cleaned);
      outputs.push(`Query OK, 0 rows affected (0.00 sec).`);

    } catch (err) {
      const errMsg = `ERROR: ${err.message}\nAt SQL statement #${i + 1}:\n"${rawStmt.split('\n')[0].slice(0, 80)}"`;
      outputs.push(errMsg);
      return {
        success: false,
        stdout: outputs.join('\n\n'),
        stderr: errMsg,
        runtimeMs: Date.now() - startTime
      };
    }
  }

  // If the user created tables and ran DDL with no SELECT query:
  // Automatically provide an informative Schema summary so the output is never blank!
  if (!hasSelectQuery && createdTablesCount > 0) {
    try {
      const allTables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
      if (allTables.length > 0) {
        const summaryRows = allTables.map(t => {
          const colInfo = db.prepare(`PRAGMA table_info(${t.name})`).all();
          return {
            Table: t.name,
            'Total Columns': `${colInfo.length} column(s)`,
            'Column Names': colInfo.map(c => c.name).join(', ')
          };
        });

        outputs.push(
          `--------------------------------------------------\n` +
          `Active Database Schema Status: '${activeDatabase}'\n` +
          formatAsciiTable(summaryRows) + '\n' +
          `✨ ${allTables.length} table(s) defined and verified. Ready for INSERT / SELECT queries.`
        );
      }
    } catch {}
  }

  return {
    success: true,
    stdout: outputs.join('\n\n'),
    stderr: null,
    runtimeMs: Math.max(10, Date.now() - startTime)
  };
}
