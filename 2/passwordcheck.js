const fs = require('fs');
const readline = require('readline');

let noofValidPasswords = 0;

async function processLineByLine() {
  const fileStream = fs.createReadStream('data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (isPasswordValidPartTwo(line)) {
      noofValidPasswords++;
    }
  }
}

function isPasswordValid(line) {
  const parsedLine = parseLine(line);
  const re = new RegExp(parsedLine.letter, 'g');
  const noofOccurrences = (parsedLine.password.match(re) || []).length;

  return noofOccurrences >= parsedLine.min && noofOccurrences <= parsedLine.max;
}

function isPasswordValidPartTwo(line) {
  const p = parseLine(line);
  const firstPosMatch = p.password[p.min - 1] === p.letter;
  const secondPosMatch = p.password[p.max - 1] === p.letter;

  return firstPosMatch ^ secondPosMatch;
}

function parseLine(line) {
  // 11-13 d: dddddddddblddmddk
  const parts = line.split(' ');
  const minMax = parts[0].split('-');
  return {
    min: minMax[0],
    max: minMax[1],
    letter: parts[1][0],
    password: parts[2]
  };
}

async function main() {
  await processLineByLine();
  console.log(noofValidPasswords);
}

main();
