const fs = require('fs');
const { prependOnceListener } = require('process');
const readline = require('readline');

const groups = new Array();

async function processLineByLine() {
  const fileStream = fs.createReadStream('data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currData = '';

  for await (const line of rl) {
    if (line.length === 0) {
      
      groups.push(createUniqueSet(currData));
      currData = '';
    } else {
      currData = currData + line;
    }
  }
  groups.push(createUniqueSet(currData));
}

function createUniqueSet(groupData) {
  const uniqueChars = new Set();
  [...groupData].forEach(letter => uniqueChars.add(letter));
  return uniqueChars;
}

async function main() {
  await processLineByLine();
  console.log(groups);

  console.log(groups.map(group => group.size).reduce((a,b) => a+b,0));
}

main();
