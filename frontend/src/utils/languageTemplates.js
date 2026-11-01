// 15 Supported Languages Config & Boilerplates grouped by category

export const LANGUAGE_CATEGORIES = [
  {
    category: 'General Purpose & Enterprise',
    languages: ['JAVA', 'PYTHON', 'CSHARP', 'GO']
  },
  {
    category: 'Web Development',
    languages: ['JAVASCRIPT', 'TYPESCRIPT', 'PHP', 'RUBY']
  },
  {
    category: 'Systems & Performance',
    languages: ['C', 'CPP', 'RUST']
  },
  {
    category: 'Data, Math & Databases',
    languages: ['SQL', 'R', 'JULIA', 'MATLAB']
  }
];

export const LANGUAGE_CONFIG = {
  // General Purpose & Enterprise
  JAVA: {
    label: 'Java (OpenJDK 17)',
    monacoLang: 'java',
    ext: '.java',
    category: 'General Purpose & Enterprise',
    description: 'Enterprise software, Android apps, and large-scale backend systems.'
  },
  PYTHON: {
    label: 'Python 3',
    monacoLang: 'python',
    ext: '.py',
    category: 'General Purpose & Enterprise',
    description: 'Data science, artificial intelligence, automation, and backend web development.'
  },
  CSHARP: {
    label: 'C# (.NET)',
    monacoLang: 'csharp',
    ext: '.cs',
    category: 'General Purpose & Enterprise',
    description: 'Windows applications, enterprise software, and game development.'
  },
  GO: {
    label: 'Go (Golang)',
    monacoLang: 'go',
    ext: '.go',
    category: 'General Purpose & Enterprise',
    description: 'Cloud-native applications, microservices, and concurrent backend systems.'
  },

  // Web Development
  JAVASCRIPT: {
    label: 'JavaScript (Node.js)',
    monacoLang: 'javascript',
    ext: '.js',
    category: 'Web Development',
    description: 'The foundational language for interactive front-end & full-stack development.'
  },
  TYPESCRIPT: {
    label: 'TypeScript',
    monacoLang: 'typescript',
    ext: '.ts',
    category: 'Web Development',
    description: 'A strict, strongly-typed superset of JavaScript for large-scale web apps.'
  },
  PHP: {
    label: 'PHP (8.x)',
    monacoLang: 'php',
    ext: '.php',
    category: 'Web Development',
    description: 'Server-side web development.'
  },
  RUBY: {
    label: 'Ruby (3.x)',
    monacoLang: 'ruby',
    ext: '.rb',
    category: 'Web Development',
    description: 'Rapid web application development.'
  },

  // Systems & Performance
  C: {
    label: 'C (GCC 11)',
    monacoLang: 'c',
    ext: '.c',
    category: 'Systems & Performance',
    description: 'Operating systems, embedded hardware, and high-performance computing.'
  },
  CPP: {
    label: 'C++ (GCC 12)',
    monacoLang: 'cpp',
    ext: '.cpp',
    category: 'Systems & Performance',
    description: 'Game engines, real-time systems, and resource-intensive applications.'
  },
  RUST: {
    label: 'Rust',
    monacoLang: 'rust',
    ext: '.rs',
    category: 'Systems & Performance',
    description: 'Memory-safe systems programming.'
  },

  // Data, Math & Databases
  SQL: {
    label: 'SQL (PostgreSQL / ANSI)',
    monacoLang: 'sql',
    ext: '.sql',
    category: 'Data, Math & Databases',
    description: 'Relational database management and data querying.'
  },
  R: {
    label: 'R (Statistical Computing)',
    monacoLang: 'r',
    ext: '.r',
    category: 'Data, Math & Databases',
    description: 'Statistical computing, bioinformatics, and data analysis.'
  },
  JULIA: {
    label: 'Julia',
    monacoLang: 'julia',
    ext: '.jl',
    category: 'Data, Math & Databases',
    description: 'High-performance numerical analysis and computational science.'
  },
  MATLAB: {
    label: 'MATLAB / Octave',
    monacoLang: 'plaintext',
    ext: '.m',
    category: 'Data, Math & Databases',
    description: 'Academic engineering, linear algebra, and scientific computing.'
  }
};

/**
 * Returns idiomatic starter code for any problem across all 15 languages
 */
export function getStarterCode(lang, problem) {
  const norm = (lang || 'PYTHON').toUpperCase();
  const title = problem?.title || 'Problem Solution';

  if (problem?.starterCode?.[norm]) {
    return problem.starterCode[norm];
  }

  switch (norm) {
    case 'JAVA':
      return `import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        // Solution for: ${title}
        // Write your solution here
        
    }
}
`;

    case 'PYTHON':
      return `import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    # Solution for: ${title}
    # Write your solution here
    
if __name__ == '__main__':
    solve()
`;

    case 'CSHARP':
      return `using System;
using System.Collections.Generic;

public class Solution {
    public static void Main(string[] args) {
        // Solution for: ${title}
        string input = Console.ReadLine();
        if (string.IsNullOrEmpty(input)) return;
        
        // Write your solution here
        
    }
}
`;

    case 'GO':
      return `package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    // Solution for: ${title}
    scanner := bufio.NewScanner(os.Stdin)
    if !scanner.Scan() {
        return
    }
    
    // Write your solution here
    
}
`;

    case 'JAVASCRIPT':
      return `const fs = require('fs');

function solve() {
    // Solution for: ${title}
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    
    // Write your solution here
    
}

solve();
`;

    case 'TYPESCRIPT':
      return `import * as fs from 'fs';

function solve(): void {
    // Solution for: ${title}
    const input: string = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    
    // Write your solution here
    
}

solve();
`;

    case 'PHP':
      return `<?php
// Solution for: ${title}
$stdin = fopen('php://stdin', 'r');
if (!$stdin) exit(0);

// Write your solution here

fclose($stdin);
?>
`;

    case 'RUBY':
      return `def solve
  # Solution for: ${title}
  input = ARGF.read
  return if input.nil? || input.strip.empty?
  
  # Write your solution here
  
end

solve
`;

    case 'C':
      return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Solution for: ${title}
    // Read input from standard input
    
    // Write your solution here
    
    return 0;
}
`;

    case 'CPP':
      return `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Solution for: ${title}
    // Write your solution here
    
    return 0;
}
`;

    case 'RUST':
      return `use std::io::{self, Read};

fn main() {
    // Solution for: ${title}
    let mut input = String::new();
    if io::stdin().read_to_string(&mut input).is_err() || input.trim().is_empty() {
        return;
    }
    
    // Write your solution here
    
}
`;

    case 'SQL':
      return `-- Solution for: ${title}
-- Write your query below to compute the expected result:
SELECT *
FROM solution_table;
`;

    case 'R':
      return `# Solution for: ${title}
# Read input from standard input
input <- readLines(file("stdin"), warn = FALSE)
if (length(input) == 0) quit(status = 0)

# Write your statistical solution here

`;

    case 'JULIA':
      return `# Solution for: ${title}
function solve()
    input = read(stdin, String)
    if isempty(strip(input))
        return
    end
    
    # Write your high-performance solution here
    
end

solve()
`;

    case 'MATLAB':
      return `% Solution for: ${title}
function solution()
    input_str = fileread('/dev/stdin');
    if isempty(strtrim(input_str))
        return;
    end
    
    % Write your algorithm here
    
end
`;

    default:
      return `# Write your solution here`;
  }
}
