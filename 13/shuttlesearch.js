const { dir } = require('console');
const fs = require('fs');
const { prependOnceListener } = require('process');
const readline = require('readline');

const busses = new Array();
const bussesWithGaps = new Array();
let earliestBus = 0;

async function processLineByLine() {
  const fileStream = fs.createReadStream('data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCounter = 0;
  for await (const line of rl) {

    if (lineCounter === 0) {
      earliestBus = parseInt(line);
      lineCounter++;
    } else {
      line.split(',').forEach((val, ix) => {
        if (val !== 'x') {
          busses.push(parseInt(val));
          bussesWithGaps.push(parseInt(val));
        } else {
          bussesWithGaps.push(-1);
        }
      });
    }
  }
}

// Highly inspired by Max Davidson
function findTimestampWithOffsetDepartures() {
  let tstamp = 1;
  let stepSize = 1;

  for (let ix = 0; ix < bussesWithGaps.length; ix++) {
    const busId = bussesWithGaps[ix];
    if (busId < 1)
      continue;

    while ((tstamp+ix) % busId != 0) {
      tstamp += stepSize;
    }

    stepSize *= busId;
  }
  return tstamp;
}

function findEarliestBus() {
  const waitTimes = busses.map((d) => d - (earliestBus % d));
  console.log(waitTimes);

  let lowest = Math.min(...waitTimes);

  for (ix = 0; ix < waitTimes.length; ix++) {
    if (waitTimes[ix] === lowest) {
      return {
        lowest,
        busId: busses[ix]
      }
    }
  }
}

async function main() {
  await processLineByLine();

  console.log(earliestBus);
  console.log(busses);

  const result = findEarliestBus();
  console.log(result);
  console.log('Product:', result.lowest * result.busId);

  console.log('Part 2:',findTimestampWithOffsetDepartures());
}

main();
