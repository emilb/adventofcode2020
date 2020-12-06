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
  let currArray = new Array();

  for await (const line of rl) {
    if (line.length === 0) {
      
      groups.push( {
        set: createUniqueSet(currData),
        arr: currArray
      });
      currData = '';
      currArray = new Array();
    } else {
      currData = currData + line;
      currArray.push(line);
    }
  }

  groups.push( {
    set: createUniqueSet(currData),
    arr: currArray
  });
}

function createUniqueSet(groupData) {
  const uniqueChars = new Set();
  [...groupData].forEach(letter => uniqueChars.add(letter));
  return [...uniqueChars];
}

async function main() {
  await processLineByLine();

  const filtered = groups.map(group => {
    return group.set.filter(c => {
      let result = true;

      group.arr.forEach(a => {
        if (a.indexOf(c) === -1)
          result = false;
      })
      return result;
    })
  });

  console.log(filtered.map(f => f.length).reduce((a,b) => a+b,0));
  //console.log(groups.map(group => group.size).reduce((a,b) => a+b,0));
}

main();
