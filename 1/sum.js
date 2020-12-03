const fs = require('fs');
const readline = require('readline');

const data = new Array();

async function processLineByLine() {
  const fileStream = fs.createReadStream('data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    data.push(parseInt(line));
  }
}

function findFromEndWhereSumIs(sum, value, data) {

  for (k = data.length-1; k >= 0; k--) {
    const complement = data[k];
    
    if (value + complement < sum)
      return -1;

    if (value + complement == sum)
      return complement;
  }
}

async function readData() {
  console.log('reading data...');
  await processLineByLine();

  console.log('sorting...');
  data.sort(function(a, b){return a-b});
}

function findTuple() {
  for (i = 0; i < data.length; i++) {
    const val = data[i];
    const complement = findFromEndWhereSumIs(2020, val, data);
  
    if (complement > 0) {
      console.log(`${val} + ${complement} = ${val + complement}`);
      console.log(`${val} * ${complement} = ${val*complement}`);
      process.exit(0);
    }
  }
}

function findTriple() {
  for (i = 0; i < data.length-1; i++) {
    for (j=i+1; j < data.length; j++) {
      const val = data[i] + data[j];
      const complement = findFromEndWhereSumIs(2020, val, data);
    
      if (complement > 0) {
        console.log(`${data[i]} + ${data[j]} + ${complement} = ${data[i] + data[j] + complement}`);
        console.log(`${data[i]} * ${data[j]} * ${complement} = ${data[i]*data[j]*complement}`);
        process.exit(0);
      }
      if (i < 0) 
        process.exit(1);
    }
    
  }
}

async function main() {
  await readData();
  //findTuple();
  findTriple();
}

main();



