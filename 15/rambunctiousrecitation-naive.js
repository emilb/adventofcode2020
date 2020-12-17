const { dir } = require('console');
const fs = require('fs');
const readline = require('readline');

const initalValues = new Array();

async function processLineByLine() {
  const fileStream = fs.createReadStream('data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  for await (const line of rl) {
    // only one line in this input, split by ,
    console.log(line)
    const values = line.split(',').map((a) => parseInt(a));
    initalValues.push(...values);
  }
}

function play(playHistory, playLength) {
  const play = new Array();
  play.push(...playHistory);

  
  while (play.length < playLength) {
    //console.log(play);
    play.push(getNextNumber(play));
  }

  return play;
}

function getNextNumber(playHistory) {
  const lastVal = getLastValue(playHistory);

  const lastOcurrence = getLastValueOccurrence(playHistory.slice(0, playHistory.length-1), lastVal);

  if (lastOcurrence < 0) {
    // new number
    return 0;
  }

  return (playHistory.length-1) - lastOcurrence;
}

function getLastValue(arr) {
  return arr[arr.length-1];
}

function getLastValueOccurrence(arr, val) {
  return arr.lastIndexOf(val);
}

async function main() {
  await processLineByLine();
  
  const values = play(initalValues, 2020);

  //values.forEach((val, ix) => console.log(ix + ': ' + val));
  console.log(getLastValue(values));
}

main();