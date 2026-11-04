export default [
  {
    "no": 1,
    "id": "prob-1",
    "slug": "p1-two-integers-and-print-their-sum",
    "title": "Two Integers and Print Their Sum",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 80,
    "submissionsCount": 47989,
    "acceptedCount": 38391,
    "statement": "Given two integers a and b, return their sum.",
    "descriptionMd": "Given two integers a and b, return their sum.\n\nExample 1:\nInput: a = 12, b = 25\nOutput: 37\nExplanation:\n12 + 25 = 37.\n\nExample 2:\nInput: a = -15, b = 40\nOutput: 25\nExplanation:\n-15 + 40 = 25.\n\nConstraints:\n-10^9 <= a, b <= 10^9\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "12 25",
        "output": "37",
        "explanation": "12 + 25 = 37."
      },
      {
        "input": "-15 40",
        "output": "25",
        "explanation": "-15 + 40 = 25."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 2,
    "id": "prob-2",
    "slug": "p2-a-number-is-even-or-odd",
    "title": "Number Is Even or Odd",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 74.4,
    "submissionsCount": 47978,
    "acceptedCount": 35696,
    "statement": "Given an integer n, return \"Even\" if the number is even, or \"Odd\" if it is odd.\n\nAn integer is even if it is divisible by 2 with no remainder. Otherwise, it is odd.",
    "descriptionMd": "Given an integer n, return \"Even\" if the number is even, or \"Odd\" if it is odd.\n\nAn integer is even if it is divisible by 2 with no remainder. Otherwise, it is odd.\n\nExample 1:\nInput: n = 4\nOutput: Even\nExplanation:\n4 is divisible by 2 with remainder 0.\n\nExample 2:\nInput: n = 7\nOutput: Odd\nExplanation:\n7 divided by 2 leaves remainder 1.\n\nConstraints:\n-10^9 <= n <= 10^9\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "4",
        "output": "Even",
        "explanation": "4 is divisible by 2 with remainder 0."
      },
      {
        "input": "7",
        "output": "Odd",
        "explanation": "7 divided by 2 leaves remainder 1."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 3,
    "id": "prob-3",
    "slug": "p3-largest-of-three-given-numbers",
    "title": "Largest of Three Given Numbers",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 68.8,
    "submissionsCount": 47967,
    "acceptedCount": 33001,
    "statement": "Given three integers a, b, and c, return the maximum value among them.",
    "descriptionMd": "Given three integers a, b, and c, return the maximum value among them.\n\nExample 1:\nInput: a = 10, b = 45, c = 23\nOutput: 45\nExplanation:\n45 is greater than both 10 and 23.\n\nExample 2:\nInput: a = -10, b = -5, c = -20\nOutput: -5\nExplanation:\n-5 is the largest value among negative integers.\n\nConstraints:\n-10^9 <= a, b, c <= 10^9\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "10 45 23",
        "output": "45",
        "explanation": "45 is greater than both 10 and 23."
      },
      {
        "input": "-10 -5 -20",
        "output": "-5",
        "explanation": "-5 is the largest value among negative integers."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 4,
    "id": "prob-4",
    "slug": "p4-the-multiplication-table-of-a-number-up-to-10",
    "title": "Multiplication Table of a Number Up to 10",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 80.7,
    "submissionsCount": 47956,
    "acceptedCount": 38700,
    "statement": "Given an integer n, return its multiplication table from 1 to 10.\n\nEach line should contain the product n * i for i from 1 to 10.",
    "descriptionMd": "Given an integer n, return its multiplication table from 1 to 10.\n\nEach line should contain the product n * i for i from 1 to 10.\n\nExample 1:\nInput: n = 3\nOutput: 3\n6\n9\n12\n15\n18\n21\n24\n27\n30\nExplanation:\nMultiplication table of 3 for multipliers 1 through 10.\n\nConstraints:\n1 <= n <= 1000\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "3",
        "output": "3\n6\n9\n12\n15\n18\n21\n24\n27\n30",
        "explanation": "Multiplication table of 3 for multipliers 1 through 10."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 5,
    "id": "prob-5",
    "slug": "p5-factorial-of-a-number-n-n-at-most-20",
    "title": "Factorial of a Number N (n at Most 20)",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 75.1,
    "submissionsCount": 47945,
    "acceptedCount": 36007,
    "statement": "Given an integer n (0 <= n <= 20), return the factorial of n (n!).\n\nThe factorial of a non-negative integer n is the product of all positive integers less than or equal to n. Note that 0! = 1.",
    "descriptionMd": "Given an integer n (0 <= n <= 20), return the factorial of n (n!).\n\nThe factorial of a non-negative integer n is the product of all positive integers less than or equal to n. Note that 0! = 1.\n\nExample 1:\nInput: n = 5\nOutput: 120\nExplanation:\n5! = 5 * 4 * 3 * 2 * 1 = 120.\n\nExample 2:\nInput: n = 0\nOutput: 1\nExplanation:\n0! is defined as 1.\n\nConstraints:\n0 <= n <= 20\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "5",
        "output": "120",
        "explanation": "5! = 5 * 4 * 3 * 2 * 1 = 120."
      },
      {
        "input": "0",
        "output": "1",
        "explanation": "0! is defined as 1."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 6,
    "id": "prob-6",
    "slug": "p6-a-number-is-prime",
    "title": "Number Is Prime",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 69.5,
    "submissionsCount": 47934,
    "acceptedCount": 33314,
    "statement": "Given a positive integer n, return \"YES\" if n is a prime number, or \"NO\" otherwise.\n\nA prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.",
    "descriptionMd": "Given a positive integer n, return \"YES\" if n is a prime number, or \"NO\" otherwise.\n\nA prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.\n\nExample 1:\nInput: n = 29\nOutput: YES\nExplanation:\n29 is a prime number.\n\nExample 2:\nInput: n = 1\nOutput: NO\nExplanation:\n1 is not considered a prime number.\n\nConstraints:\n1 <= n <= 10^9\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "29",
        "output": "YES",
        "explanation": "29 is a prime number."
      },
      {
        "input": "1",
        "output": "NO",
        "explanation": "1 is not considered a prime number."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 7,
    "id": "prob-7",
    "slug": "p7-the-first-n-terms-of-the-fibonacci-series",
    "title": "First N Terms of the Fibonacci Series",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 81.4,
    "submissionsCount": 47923,
    "acceptedCount": 39009,
    "statement": "Given an integer n, return the first n numbers of the Fibonacci sequence.\n\nThe Fibonacci sequence is a sequence of numbers where each number is the sum of the two preceding ones, starting from 0 and 1. That is:\nF(0) = 0, F(1) = 1\nF(i) = F(i - 1) + F(i - 2) for i >= 2.",
    "descriptionMd": "Given an integer n, return the first n numbers of the Fibonacci sequence.\n\nThe Fibonacci sequence is a sequence of numbers where each number is the sum of the two preceding ones, starting from 0 and 1. That is:\nF(0) = 0, F(1) = 1\nF(i) = F(i - 1) + F(i - 2) for i >= 2.\n\nExample 1:\nInput: n = 5\nOutput: 0 1 1 2 3\nExplanation:\nThe first 5 numbers in the Fibonacci sequence are 0, 1, 1, 2, 3.\n\nExample 2:\nInput: n = 8\nOutput: 0 1 1 2 3 5 8 13\nExplanation:\nEach subsequent number is generated by adding the last two numbers: 0+1=1, 1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13.\n\nConstraints:\n1 <= n <= 45\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "5",
        "output": "0 1 1 2 3",
        "explanation": "The first 5 numbers in the Fibonacci sequence are 0, 1, 1, 2, 3."
      },
      {
        "input": "8",
        "output": "0 1 1 2 3 5 8 13",
        "explanation": "Each subsequent number is generated by adding the last two numbers: 0+1=1, 1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 8,
    "id": "prob-8",
    "slug": "p8-reverse-the-digits-of-an-integer",
    "title": "Reverse the Digits of an Integer",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 75.8,
    "submissionsCount": 47912,
    "acceptedCount": 36317,
    "statement": "Given an integer n, return the integer with its digits reversed. If the number is negative, the negative sign should remain at the beginning.",
    "descriptionMd": "Given an integer n, return the integer with its digits reversed. If the number is negative, the negative sign should remain at the beginning.\n\nExample 1:\nInput: n = 1234\nOutput: 4321\nExplanation:\nReversing the digits gives 4321.\n\nExample 2:\nInput: n = -560\nOutput: -65\nExplanation:\nReversing 560 gives 065 (65), keeping sign gives -65.\n\nConstraints:\n-10^9 <= n <= 10^9\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "1234",
        "output": "4321",
        "explanation": "Reversing the digits gives 4321."
      },
      {
        "input": "-560",
        "output": "-65",
        "explanation": "Reversing 560 gives 065 (65), keeping sign gives -65."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 9,
    "id": "prob-9",
    "slug": "p9-a-number-is-a-palindrome",
    "title": "Number Is a Palindrome",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 70.2,
    "submissionsCount": 47901,
    "acceptedCount": 33627,
    "statement": "Given an integer n, return \"YES\" if n is a palindrome, or \"NO\" otherwise.\n\nAn integer is a palindrome when it reads the same backward as forward. Negative numbers are not palindromes.",
    "descriptionMd": "Given an integer n, return \"YES\" if n is a palindrome, or \"NO\" otherwise.\n\nAn integer is a palindrome when it reads the same backward as forward. Negative numbers are not palindromes.\n\nExample 1:\nInput: n = 121\nOutput: YES\nExplanation:\n121 reads as 121 from left to right and from right to left.\n\nExample 2:\nInput: n = -121\nOutput: NO\nExplanation:\nFrom left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.\n\nConstraints:\n-2^31 <= n <= 2^31 - 1\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "121",
        "output": "YES",
        "explanation": "121 reads as 121 from left to right and from right to left."
      },
      {
        "input": "-121",
        "output": "NO",
        "explanation": "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 10,
    "id": "prob-10",
    "slug": "p10-sum-of-the-digits-of-a-number",
    "title": "Sum of the Digits of a Number",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 82.1,
    "submissionsCount": 47890,
    "acceptedCount": 39318,
    "statement": "Given a positive integer n, return the sum of its decimal digits.",
    "descriptionMd": "Given a positive integer n, return the sum of its decimal digits.\n\nExample 1:\nInput: n = 12345\nOutput: 15\nExplanation:\n1 + 2 + 3 + 4 + 5 = 15.\n\nExample 2:\nInput: n = 908\nOutput: 17\nExplanation:\n9 + 0 + 8 = 17.\n\nConstraints:\n0 <= n <= 10^18\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "12345",
        "output": "15",
        "explanation": "1 + 2 + 3 + 4 + 5 = 15."
      },
      {
        "input": "908",
        "output": "17",
        "explanation": "9 + 0 + 8 = 17."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 11,
    "id": "prob-11",
    "slug": "p11-digits-in-an-integer",
    "title": "Digits in an Integer",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 76.5,
    "submissionsCount": 47879,
    "acceptedCount": 36627,
    "statement": "Given an integer n, return the total number of digits in n.",
    "descriptionMd": "Given an integer n, return the total number of digits in n.\n\nExample 1:\nInput: n = 12345\nOutput: 5\nExplanation:\n12345 has 5 digits.\n\nExample 2:\nInput: n = 0\nOutput: 1\nExplanation:\n0 has 1 digit.\n\nConstraints:\n-10^18 <= n <= 10^18\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "12345",
        "output": "5",
        "explanation": "12345 has 5 digits."
      },
      {
        "input": "0",
        "output": "1",
        "explanation": "0 has 1 digit."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 12,
    "id": "prob-12",
    "slug": "p12-a-number-is-an-armstrong-number",
    "title": "Number Is an Armstrong Number",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 70.9,
    "submissionsCount": 47868,
    "acceptedCount": 33938,
    "statement": "Given an integer n, return \"YES\" if it is an Armstrong number, or \"NO\" otherwise.\n\nAn Armstrong number of k digits is an integer such that the sum of its digits raised to the power k equals the number itself.",
    "descriptionMd": "Given an integer n, return \"YES\" if it is an Armstrong number, or \"NO\" otherwise.\n\nAn Armstrong number of k digits is an integer such that the sum of its digits raised to the power k equals the number itself.\n\nExample 1:\nInput: n = 153\nOutput: YES\nExplanation:\n1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153.\n\nExample 2:\nInput: n = 120\nOutput: NO\nExplanation:\n1^3 + 2^3 + 0^3 = 1 + 8 + 0 = 9 != 120.\n\nConstraints:\n1 <= n <= 10^9\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "153",
        "output": "YES",
        "explanation": "1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153."
      },
      {
        "input": "120",
        "output": "NO",
        "explanation": "1^3 + 2^3 + 0^3 = 1 + 8 + 0 = 9 != 120."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 13,
    "id": "prob-13",
    "slug": "p13-gcd-of-two-numbers",
    "title": "GCD of Two Numbers",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 82.8,
    "submissionsCount": 47857,
    "acceptedCount": 39626,
    "statement": "Given two positive integers a and b, return their Greatest Common Divisor (GCD).\n\nThe GCD of two integers is the largest positive integer that divides both numbers without leaving a remainder.",
    "descriptionMd": "Given two positive integers a and b, return their Greatest Common Divisor (GCD).\n\nThe GCD of two integers is the largest positive integer that divides both numbers without leaving a remainder.\n\nExample 1:\nInput: a = 24, b = 36\nOutput: 12\nExplanation:\nThe greatest common divisor of 24 and 36 is 12.\n\nExample 2:\nInput: a = 17, b = 19\nOutput: 1\nExplanation:\n17 and 19 are coprime, so their GCD is 1.\n\nConstraints:\n1 <= a, b <= 10^12\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "24 36",
        "output": "12",
        "explanation": "The greatest common divisor of 24 and 36 is 12."
      },
      {
        "input": "17 19",
        "output": "1",
        "explanation": "17 and 19 are coprime, so their GCD is 1."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 14,
    "id": "prob-14",
    "slug": "p14-lcm-of-two-numbers",
    "title": "LCM of Two Numbers",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 77.2,
    "submissionsCount": 47846,
    "acceptedCount": 36937,
    "statement": "Find the LCM of two numbers.\n\nReturn the computed result satisfying all constraints.",
    "descriptionMd": "Find the LCM of two numbers.\n\nReturn the computed result satisfying all constraints.\n\nExample 1:\nInput: n = 5\nOutput: 15\nExplanation:\nProcessing the input values produces the expected result.\n\nConstraints:\n1 <= n <= 10^5\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "15",
        "explanation": "Processing the input values produces the expected result."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 15,
    "id": "prob-15",
    "slug": "p15-convert-a-temperature-from-celsius-to-fahrenheit",
    "title": "Convert a Temperature From Celsius to Fahrenheit",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 71.6,
    "submissionsCount": 47835,
    "acceptedCount": 34250,
    "statement": "Convert a temperature from Celsius to Fahrenheit.\n\nReturn the computed result satisfying all constraints.",
    "descriptionMd": "Convert a temperature from Celsius to Fahrenheit.\n\nReturn the computed result satisfying all constraints.\n\nExample 1:\nInput: n = 5\nOutput: 15\nExplanation:\nProcessing the input values produces the expected result.\n\nConstraints:\n1 <= n <= 10^5\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "15",
        "explanation": "Processing the input values produces the expected result."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 16,
    "id": "prob-16",
    "slug": "p16-a-given-year-is-a-leap-year",
    "title": "Given Year Is a Leap Year",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 83.5,
    "submissionsCount": 47824,
    "acceptedCount": 39933,
    "statement": "Check whether a given year is a leap year.\n\nReturn the computed result satisfying all constraints.",
    "descriptionMd": "Check whether a given year is a leap year.\n\nReturn the computed result satisfying all constraints.\n\nExample 1:\nInput: n = 5\nOutput: 15\nExplanation:\nProcessing the input values produces the expected result.\n\nConstraints:\n1 <= n <= 10^5\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "15",
        "explanation": "Processing the input values produces the expected result."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 17,
    "id": "prob-17",
    "slug": "p17-all-prime-numbers-up-to-n",
    "title": "Prime Numbers Up to N",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 77.9,
    "submissionsCount": 47313,
    "acceptedCount": 36857,
    "statement": "Print all prime numbers up to n.\n\nReturn the computed result satisfying all constraints.",
    "descriptionMd": "Print all prime numbers up to n.\n\nReturn the computed result satisfying all constraints.\n\nExample 1:\nInput: n = 5\nOutput: 15\nExplanation:\nProcessing the input values produces the expected result.\n\nConstraints:\n1 <= n <= 10^5\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "15",
        "explanation": "Processing the input values produces the expected result."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 18,
    "id": "prob-18",
    "slug": "p18-sum-of-the-first-n-natural-numbers",
    "title": "Sum of the First N Natural Numbers",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 72.3,
    "submissionsCount": 47302,
    "acceptedCount": 34199,
    "statement": "Find the sum of the first n natural numbers.\n\nReturn the computed result satisfying all constraints.",
    "descriptionMd": "Find the sum of the first n natural numbers.\n\nReturn the computed result satisfying all constraints.\n\nExample 1:\nInput: n = 5\nOutput: 15\nExplanation:\nProcessing the input values produces the expected result.\n\nConstraints:\n1 <= n <= 10^5\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "15",
        "explanation": "Processing the input values produces the expected result."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 19,
    "id": "prob-19",
    "slug": "p19-x-raised-to-the-power-n-without-using-a-power-func",
    "title": "X Raised to the Power N Without Using a Power Function",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 84.2,
    "submissionsCount": 47291,
    "acceptedCount": 39819,
    "statement": "Compute x raised to the power n without using a power function.\n\nReturn the computed result satisfying all constraints.",
    "descriptionMd": "Compute x raised to the power n without using a power function.\n\nReturn the computed result satisfying all constraints.\n\nExample 1:\nInput: n = 5\nOutput: 15\nExplanation:\nProcessing the input values produces the expected result.\n\nConstraints:\n1 <= n <= 10^5\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "15",
        "explanation": "Processing the input values produces the expected result."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  },
  {
    "no": 20,
    "id": "prob-20",
    "slug": "p20-a-number-is-a-perfect-square",
    "title": "Number Is a Perfect Square",
    "difficulty": "EASY",
    "topic": "Basics & Math",
    "tags": [
      "Basics & Math",
      "Basics",
      "Math",
      "easy"
    ],
    "acceptanceRate": 78.6,
    "submissionsCount": 47280,
    "acceptedCount": 37162,
    "statement": "Check whether a number is a perfect square.\n\nReturn the computed result satisfying all constraints.",
    "descriptionMd": "Check whether a number is a perfect square.\n\nReturn the computed result satisfying all constraints.\n\nExample 1:\nInput: n = 5\nOutput: 15\nExplanation:\nProcessing the input values produces the expected result.\n\nConstraints:\n1 <= n <= 10^5\nTime Limit: 1.0s\nMemory Limit: 256 MB\n",
    "timeLimitMs": 1000,
    "memoryLimitMb": 256,
    "sampleCases": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "15",
        "explanation": "Processing the input values produces the expected result."
      }
    ],
    "starterCode": {
      "PYTHON": "import sys\n\ndef solve():\n    # Read all tokens from standard input\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution logic here\n    # Example:\n    # n = int(input_data[0])\n    # print(...)\n\nif __name__ == '__main__':\n    solve()\n",
      "CPP": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Fast I/O\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    // Write your solution logic here\n    \n    return 0;\n}\n",
      "JAVA": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            // Write your solution logic here\n        }\n    }\n}\n",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\n    if (!input || input.length === 0 || input[0] === '') return;\n\n    // Write your solution logic here\n}\n\nsolve();\n",
      "C": "#include <stdio.h>\n\nint main() {\n    // Fast input/output\n    // Write your solution logic here\n    return 0;\n}\n"
    }
  }
];
