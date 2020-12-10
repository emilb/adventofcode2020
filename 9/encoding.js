const fs = require('fs');
const { prependOnceListener } = require('process');
const readline = require('readline');

const values = new Array();
const preambleLength = 25;

async function processLineByLine() {
  const fileStream = fs.createReadStream('data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    values.push(parseInt(line));
  }
}

function hasCorrectSum(numbers, value) {

  for (i = 0; i < numbers.length; i++) {
    const rest = numbers.slice(i+1);
    const primary = numbers[i];

    for (j = 0; j < rest.length; j++) {
      if (primary + rest[j] === value) {
        return true;
      }
    }
  }
}

function findInvalidValueInSequence(sequence) {
  
  for (pointer = preambleLength; pointer < sequence.length; pointer++) {

    const numbers = sequence.slice(pointer-preambleLength, pointer);
    const value = sequence[pointer];

    if (!hasCorrectSum(numbers, value)) {
      return value;
    }
  }
}

function findRangeWithSum(sequence, sum) {
  
  for (i=0; i<sequence.length; i++) {
    
    let len = 0;
    let sumSoFar = sequence[i];
    while (len+i+1 < sequence.length && sumSoFar < sum) {
      len++;
      sumSoFar+=sequence[i+len];
    }
    if (sumSoFar == sum) {
      return sequence.slice(i, i+len+1);
    }
  }
}

async function main() {
  await processLineByLine();

  const invalidValue = findInvalidValueInSequence(values);
  console.log('invalid value:', invalidValue);

  const sT = new Date();
  const rangeWithSum = findRangeWithSum(values, invalidValue);
  console.log('range took:', new Date() - sT);
  console.log('find range with sum: ', rangeWithSum);
  console.log('encryption weakness:', Math.min(...rangeWithSum) + Math.max(...rangeWithSum));
}
main();
