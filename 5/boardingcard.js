const fs = require('fs');
const { prependOnceListener } = require('process');
const readline = require('readline');

const boardingPasses = new Array();

async function processLineByLine() {
  const fileStream = fs.createReadStream('data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    boardingPasses.push(getColumnAndRow(line));
  }
}

function getColumnAndRow(line) {
  line = line.replaceAll('F', '0');
  line = line.replaceAll('B', '1');
  line = line.replaceAll('R', '1');
  line = line.replaceAll('L', '0');

  return {
    row: parseInt(line.substring(0, 7), 2),
    column: parseInt(line.substring(7, 10), 2)
  }
}

const getSeatId = columnAndRow => columnAndRow.row * 8 + columnAndRow.column;

function getSeatIds() {
  return boardingPasses.map(getSeatId).sort(function(a, b){return b-a});
}

function findMySeatId() {
  const seatIds = getSeatIds();
  const missingSeatIds = new Array();

  // Find a missing seat ID
  let previousId = -1;
  seatIds.forEach(seatId => {
    if (previousId >= 0) {
      if (previousId - seatId === 2)
        missingSeatIds.push(seatId+1);
    }

    previousId = seatId;
  });

  return missingSeatIds;
}

async function main() {
  await processLineByLine();
  console.log(getSeatIds()[0]);
  console.log(findMySeatId());
}

main();
