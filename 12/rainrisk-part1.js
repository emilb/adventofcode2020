const { dir } = require('console');
const fs = require('fs');
const { prependOnceListener } = require('process');
const readline = require('readline');

const instructions = new Array();

async function processLineByLine() {
  const fileStream = fs.createReadStream('data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const instruction = [...line][0];
    const value = parseInt([...line].slice(1).join(''));
    instructions.push({ instruction, value });
  }
}

function normalizeDirection(direction) {
  if (direction < 0)
    return direction + 360;

  if (direction > 360)
    return direction - 360;

  if (direction === 360)
    return 0;

  return direction;
}

function getNextShipState(order, shipstate) {
  switch (order.instruction) {
    case 'N':
      shipstate.north += order.value;
      break;

    case 'S':
      shipstate.north -= order.value;
      break;

    case 'E':
      shipstate.east += order.value;
      break;

    case 'W':
      shipstate.east -= order.value;
      break;

    case 'L':
      shipstate.direction = normalizeDirection(shipstate.direction - order.value);
      
      break;

    case 'R':
      shipstate.direction = normalizeDirection(shipstate.direction + order.value);
      break;

    case 'F':
      if (shipstate.direction === 0) {
        shipstate.north += order.value;
      }
      if (shipstate.direction === 90) {
        shipstate.east += order.value;
      }
      if (shipstate.direction === 180) {
        shipstate.north -= order.value;
      }
      if (shipstate.direction === 270) {
        shipstate.east -= order.value;
      }
      
      break;
  }

  return shipstate;
}

function getResultingShipState(instructionList) {
  let shipstate = {
    direction: 90,
    north: 0,
    east: 0
  }

  instructionList.forEach((order) => {
    shipstate = getNextShipState(order, shipstate);
  })
  
  return shipstate;
}

async function main() {
  await processLineByLine();

  const shipstate = getResultingShipState(instructions);
  console.log(shipstate);

  console.log('Manhattan distance:', Math.abs(shipstate.north) + Math.abs(shipstate.east));
  /*
  const stableSeatings1 = simulateTillStablePart1();
  console.log('seats taken part 1', countSeatsTaken(stableSeatings1));


  const sT = new Date();
  const stableSeatings2 = simulateTillStablePart2();
  console.log('part 2 took:', new Date() - sT);
  console.log('seats taken part 2', countSeatsTaken(stableSeatings2));
  */
}
main();
