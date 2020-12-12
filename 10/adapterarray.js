const fs = require('fs');
const { prependOnceListener } = require('process');
const readline = require('readline');

const values = new Array();

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

function prepareValues() {
  values.push(0);
  values.sort(function(a,b){return a-b});
  values.push(values[values.length-1]+3);
}

function getDiffs() {
  return values.map((val,index,arr) => {
    if (index === arr.length-1)
      return 0;

    return arr[index+1]-val;
  })
  .sort(function(a,b){return a-b})
  .slice(1);
}

function getDistribution(arr) {
  let currValue = 0;
  let currCount = 0;

  const result = new Array();

  arr.forEach(element => {
    if (currValue === element) {
      currCount++;
    } else {
      result[currValue] = currCount;
      currCount = 1;
      currValue = element;
    }
  });

  result[currValue] = currCount;

  return result;
}

function getNoofPermutations(arr) {

  const jumpsPerPosition = arr.map((val, ix) => getNoofJumpsAvailable(arr, ix));
  //console.log(jumpsPerPosition);

  const summedJumps = new Array();
  let currSum = 0;
  
  jumpsPerPosition.forEach((value, ix) => {
    if (value == 1) {
      if (currSum > 0) {
        summedJumps.push(currSum > 2 ? currSum -1 : currSum);
        currSum = 0;
      }
    } else {
      currSum += value;
    }
  });

  //console.log(summedJumps);

  const noofPerms = summedJumps.reduce((prev, curr) => prev * curr, 1);

  return noofPerms;  
}

function getNoofJumpsAvailable(arr, ix) {
  let counter = 0;
  const value = arr[ix];

  if (ix >= arr.length)
    return counter;

  currIx = ix+1;
  while (currIx <= ix + 3 && currIx < arr.length) {
    if (arr[currIx]-value <= 3) {
      counter++;
    }
    currIx++;
  }

  return counter;
}

async function main() {
  await processLineByLine();
  prepareValues();
  
  diffs = getDiffs();
  distribution = getDistribution(diffs);
  
  //console.log(values);
  //console.log(getDistribution(diffs));
  console.log(distribution[1] * distribution[3]);

  console.log(getNoofPermutations(values));
}
main();
