# Regex factorization of numbers

Factorize regexes with lists of numbers into more performant factorized Regexes

## Installation

Install with one of the following command :

```bash
npm install regex-factorize
```

or with `yarn`

```bash
yarn add regex-factorize
```

## Importation

Then you have access to two methods that can be imported with :

```ts
import { regexFromNumberArray, simplifyExistingRegex } from "regex-factorize";
```

or

```js
const {
  regexFromNumberArray,
  simplifyExistingRegex,
} = require("regex-factorize");
```

## Usage

- `regexFromNumberArray(array)` : Takes into argument an array of numbers and outputs an optimized regex
  _Example : `regexFromNumberArray([123,124,125,5678,5689])` gives : `1(2([3-5]))|5(6(78|89))`_

- `simplifyExistingRegex(string)` : Takes into argument an existing regex and simplify segments with only digits in a OR.
  _Example 1: `regexFromNumberArray("123|124|125|5678|5689")` gives : `1(2([3-5]))|5(6(78|89))`_
  _Example 2: `regexFromNumberArray("a(123|124|125|5678|5689)")` gives : `a(1(2([3-5]))|5(6(78|89)))`_
