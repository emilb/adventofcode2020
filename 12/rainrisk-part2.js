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

function rotateWaypointRight(direction, waypoint) {

  switch (direction) {
    case 90:
      return { north: waypoint.east * -1, east: waypoint.north };

    case 180:
      return { north: waypoint.north * -1, east: waypoint.east * -1 };

    case 270:
      return { north: waypoint.east, east: waypoint.north * -1 };
  }

  return waypoint;
}

function getNextShipState(order, shipstate) {
  switch (order.instruction) {
    case 'N':
      shipstate.waypoint.north += order.value;
      break;

    case 'S':
      shipstate.waypoint.north -= order.value;
      break;

    case 'E':
      shipstate.waypoint.east += order.value;
      break;

    case 'W':
      shipstate.waypoint.east -= order.value;
      break;

    case 'L':
      shipstate.waypoint = rotateWaypointRight(360-order.value, shipstate.waypoint);
      break;

    case 'R':
      shipstate.waypoint = rotateWaypointRight(order.value, shipstate.waypoint);
      break;

    case 'F':
      shipstate.north += shipstate.waypoint.north * order.value;
      shipstate.east += shipstate.waypoint.east * order.value;

      break;
  }

  return shipstate;
}

function getResultingShipState(instructionList) {
  let shipstate = {
    waypoint: {
      north: 1,
      east: 10
    },
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
