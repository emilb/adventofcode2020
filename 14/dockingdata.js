const { dir, Console } = require('console');
const fs = require('fs');
const readline = require('readline');

const memory = new Map();
const memoryPart2 = new Map();
const memoryRe = /mem\[([0-9]*)\] = ([0-9]*)/;

async function processLineByLine() {
  const fileStream = fs.createReadStream('data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currentMask = {};
  for await (const line of rl) {
    if (line.startsWith('mask')) {
      currentMask = getBitmask(line.substr(7));
    } else {
      const memMatch = line.match(memoryRe);

      const memoryPos = memMatch[1];
      const memoryVal = BigInt(memMatch[2]);

      const appliedMemoryVal = applyMask(currentMask, memoryVal);
      memory.set(memoryPos, appliedMemoryVal);
      applyMaskPart2(currentMask, memoryPos).forEach((memPos2) => {
        memoryPart2.set(memPos2, memoryVal);
      });
    }
  }
}

function applyMaskPart2(mask, value) {
  
  const permutations = new Array();

  // invert
  let val = ~BigInt(value);

  // OR floating positions to one (and then zero in next inverse)
  val = val | mask.floatsDecimal;

  // invert
  val = ~val;

  val = val | mask.onesDecimal;

  mask.floatPermutations.forEach((perm) =>  {
    const newVal = val | perm;
    permutations.push(newVal);
  });

  return permutations;
}

function applyMask(mask, value) {

  // OR ones
  let val = value | mask.onesDecimal;

  // invert
  val = ~val;

  // OR zeroes
  val = val | mask.zerosDecimal;

  // invert
  val = ~val;

  return val;
}

function applyMaskManual(maskinfo, value) {
  const mask = maskinfo.mask;
  const valuebinary = value.toString(2).padStart(mask.length, "0").split('');

  for (let ix=0; ix < mask.length; ix++) {
    if (mask[ix] != 'X')
      valuebinary[ix] = mask[ix];
  }

  return parseInt(valuebinary.join(''), 2);
}

function getBitmask(mask) {
  const ones = mask.replaceAll(/X/gi, '0');
  const zeros = mask.replaceAll(/1/gi, 'X').replaceAll(/0/gi, '1').replaceAll(/X/gi, '0');
  const floats = mask.replaceAll(/1/gi, '0').replaceAll(/X/gi, '1');

  return {
    mask,
    ones,
    onesDecimal: BigInt(parseInt(ones, 2)), 
    zeros,
    zerosDecimal: BigInt(parseInt(zeros, 2)),
    floatsDecimal: BigInt(parseInt(floats, 2)),
    floatPermutations: getFloatPermutations(floats)
  };
}

function getFloatPermutations(floats) {
  
  const permutations = new Array();
  const noofFloats = (floats.match(/1/g) || []).length;

  for (let f=0; f < Math.pow(2, noofFloats); f++) {
    const permutation = f.toString(2).padStart(noofFloats, '0');
    const appliedPermutation = applyPermutation(floats, permutation);
    permutations.push(BigInt('0b' + appliedPermutation));
  }
  return permutations;
}

function applyPermutation(floats, permutation) {
  
  let floatCounter = 0;
  let result = [];
  for (let ix=0; ix < floats.length; ix++) {
    if (floats[ix] == '1') {
      result.push(permutation[floatCounter]);
      floatCounter++;
    } else {
      result.push(floats[ix]);
    }
  }

  return result.join('');
}

function getSumOfMemory(mem) {
  let sum = 0n;
  mem.forEach(function(value, key) {
    sum += value;
  });
  return sum;
}

async function main() {
  await processLineByLine();

  console.log('Sum of memory pt1:', getSumOfMemory(memory));
  console.log('Sum of memory pt2:', getSumOfMemory(memoryPart2));
} 

main();