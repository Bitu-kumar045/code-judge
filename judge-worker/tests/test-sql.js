import { executeSqlSession } from '../sql-engine.js';

const sql = `
CREATE DATABASE boatclub;
USE boatclub;

CREATE TABLE Sailors (
  sid   INT PRIMARY KEY,
  sname VARCHAR(20) NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 10),
  age   DECIMAL(4,1)
);

CREATE TABLE Boats (
  bid   INT PRIMARY KEY,
  bname VARCHAR(20) NOT NULL,
  color VARCHAR(10)
);

CREATE TABLE Reservation (
  rid     INT PRIMARY KEY,
  sid     INT,
  bid     INT,
  rdate   DATE,      -- "date" column of the figure
  duration INT,
  FOREIGN KEY (sid) REFERENCES Sailors(sid),
  FOREIGN KEY (bid) REFERENCES Boats(bid)
);

INSERT INTO Sailors VALUES (1, 'Dustin', 7, 45.0);
INSERT INTO Sailors VALUES (2, 'Brutus', 1, 33.0);
INSERT INTO Boats VALUES (101, 'Interlake', 'blue');
INSERT INTO Reservation VALUES (1, 1, 101, '2026-11-03', 2);

SELECT * FROM Sailors;
SELECT * FROM Boats;
SELECT * FROM Reservation;
`;

async function main() {
  console.log('Testing SQL engine...');
  const res = await executeSqlSession(sql, 'SQL');
  console.log('--- OUTPUT ---');
  console.log(res.stdout);
  if (res.stderr) console.error('--- ERROR ---\n', res.stderr);
}

main().catch(console.error);
