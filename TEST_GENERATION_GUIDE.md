# Automated Test Case Generation - Phase 1 Guide

## Overview

This system allows you to automatically generate test cases for programming problems using input specifications and a correct solution. Instead of manually writing test cases, you define the structure and constraints of inputs, and the system generates random test cases and runs your correct solution to get the expected outputs.

## Features (Phase 1)

- **Supported Input Types:**
  - Integer (with min/max range)
  - 1D Array (with length constraints and element ranges)
  - String (with length constraints and character sets)

- **Test Case Types:**
  - Regular test cases (random values within constraints)
  - Edge cases (min/max constraint values)

## How to Use

### 1. Database Migration

First, run the Prisma migration to add the new fields:

```bash
cd "/media/anmol/New Volume/O.J/compiler/backend"
npx prisma migrate dev --name add_test_generation_fields
npx prisma generate
```

### 2. Frontend Setup

Update your routing to use the enhanced AddProblem component:

```javascript
// In your router file
import AddProblemEnhanced from './routes/addproblem_enhanced';

// Use AddProblemEnhanced instead of the old AddProblem
```

### 3. Creating a Problem with Auto-Generated Tests

1. **Fill in basic problem details** (title, description, statement, etc.)

2. **Enable Auto Test Case Generation** checkbox

3. **Provide your correct solution code** in the text area

4. **Select the programming language**

5. **Define Input Specification** using the Input Spec Builder:
   - Click "Add Parameter" to add each input parameter
   - For each parameter, specify:
     - Name (e.g., `n`, `arr`, `str`)
     - Type (integer, array_1d, string)
     - Constraints (depends on type)

6. **Define Format Template** (optional):
   - Specify how inputs should be formatted
   - Use placeholders like `{n}`, `{arr}`
   - Leave empty for default formatting

7. **Preview Test Case** to see what will be generated

8. **Click "Generate Test Cases"** to create all test cases

9. **Submit the problem**

## Examples

### Example 1: Two Sum Problem

**Problem:** Given an array of integers and a target sum, find if any two numbers add up to the target.

**Input Specification:**
```json
{
  "inputs": [
    {
      "name": "n",
      "type": "integer",
      "min": 2,
      "max": 1000
    },
    {
      "name": "target",
      "type": "integer",
      "min": -1000,
      "max": 1000
    },
    {
      "name": "arr",
      "type": "array_1d",
      "length": "n",
      "elementMin": -1000,
      "elementMax": 1000
    }
  ],
  "format": {
    "template": [
      "{n} {target}",
      "{arr}"
    ]
  }
}
```

**Format Template:**
- Line 1: `{n} {target}`
- Line 2: `{arr}`

**Correct Solution (C++):**
```cpp
#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

int main() {
    int n, target;
    cin >> n >> target;

    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    unordered_set<int> seen;
    bool found = false;

    for (int num : arr) {
        if (seen.count(target - num)) {
            found = true;
            break;
        }
        seen.insert(num);
    }

    cout << (found ? "YES" : "NO") << endl;
    return 0;
}
```

**Generated Test Case Example:**
```
Input:
5 10
2 7 11 15 3

Output:
YES
```

### Example 2: Palindrome Check

**Problem:** Check if a string is a palindrome.

**Input Specification:**
```json
{
  "inputs": [
    {
      "name": "str",
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "charset": "lowercase"
    }
  ]
}
```

**Correct Solution (C++):**
```cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string str;
    cin >> str;

    string rev = str;
    reverse(rev.begin(), rev.end());

    cout << (str == rev ? "YES" : "NO") << endl;
    return 0;
}
```

### Example 3: Array Statistics

**Problem:** Given an array, find min, max, and average.

**Input Specification:**
```json
{
  "inputs": [
    {
      "name": "n",
      "type": "integer",
      "min": 1,
      "max": 1000
    },
    {
      "name": "arr",
      "type": "array_1d",
      "length": {
        "min": 1,
        "max": 100
      },
      "elementMin": 1,
      "elementMax": 1000
    }
  ],
  "format": {
    "template": [
      "{n}",
      "{arr}"
    ]
  }
}
```

## API Endpoints

### Generate Test Cases

**POST** `/api/problem/generate-tests`

**Request Body:**
```json
{
  "inputSpec": {
    "inputs": [...],
    "format": { "template": [...] }
  },
  "correctSolution": "code here",
  "language": "cpp",
  "numTests": 5,
  "numEdgeCases": 2
}
```

**Response:**
```json
{
  "success": true,
  "testCases": [
    {
      "input": "...",
      "output": "...",
      "sample": false,
      "explanation": "Test case 1"
    }
  ]
}
```

### Preview Test Case

**POST** `/api/problem/preview-test`

**Request Body:**
```json
{
  "inputSpec": {...},
  "correctSolution": "code here",
  "language": "cpp",
  "isEdgeCase": false
}
```

**Response:**
```json
{
  "success": true,
  "testCase": {
    "input": "...",
    "output": "...",
    "generatedValues": {...}
  }
}
```

## Input Specification Format

### Integer Type
```json
{
  "name": "n",
  "type": "integer",
  "min": 1,
  "max": 100
}
```

### 1D Array Type
```json
{
  "name": "arr",
  "type": "array_1d",
  "length": {
    "min": 1,
    "max": 100
  },
  // OR reference another parameter:
  // "length": "n",
  "elementMin": 1,
  "elementMax": 1000
}
```

### String Type
```json
{
  "name": "str",
  "type": "string",
  "minLength": 1,
  "maxLength": 100,
  "charset": "lowercase" // or "uppercase", "digits", "alphanumeric", "all"
}
```

## Format Template

By default, each parameter is printed on a new line. Arrays are space-separated.

**Custom templates** use placeholders:
- `{parameterName}` - Replace with the value
- Each array element in template: `{arr}` becomes `1 2 3 4 5`

**Example:**
```json
{
  "format": {
    "template": [
      "{n} {m}",
      "{arr}",
      "{str}"
    ]
  }
}
```

## Troubleshooting

### Test generation fails
- Check that your correct solution compiles and runs
- Verify input specification is valid
- Check that constraints make sense (min <= max)

### Output is incorrect
- Test your correct solution manually first
- Check input format matches what your code expects
- Verify format template produces correct input structure

### Edge cases not working
- Edge cases use min/max values from constraints
- For arrays, uses min/max length

## Next Steps (Future Phases)

- **Phase 2:** 2D arrays and matrices
- **Phase 3:** Graph and tree generation
- **Phase 4:** Smart edge case generation (sorted, reverse sorted, all same, etc.)

## File Structure

```
compiler/backend/
├── services/
│   ├── testGenerators.js       # Core generation functions
│   ├── inputFormatter.js       # Format generated values to text
│   └── testCaseGenerator.js    # Orchestration and solution running
├── router/
│   └── problem.js               # API endpoints
└── prisma/
    └── schema.prisma            # Database schema

compiler/frontend/src/
├── components/
│   └── InputSpecBuilder.jsx    # Input spec UI builder
└── routes/
    └── addproblem_enhanced.jsx # Enhanced problem creation form
```
