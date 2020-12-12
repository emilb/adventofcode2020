const fs = require('fs');
const { prependOnceListener } = require('process');
const readline = require('readline');

const seats = new Array();
let width =  0;

async function processLineByLine() {
  const fileStream = fs.createReadStream('data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    parseRow(line);
    width = line.length;
  }
}

function parseRow(line) {

    [...line].forEach((c) => {
        switch (c) {
            case 'L':
              seats.push(0);
              break;
            
            case '.':
              seats.push(-1);
              break;
        
            case '#':
              seats.push(1);
              break;
          }
    });
}

function translatePosition(position) {
    y = Math.floor(position / width);
    x = position - y * width;
    return {x, y}
}

function translateCoordinate(coordinate) {
    return coordinate.x + coordinate.y * width;
}

function getNoofVisibleSeatsTaken(seatMap, position) {
    const visibleSeats = getVisibleSeats(seatMap, position);

    return visibleSeats.map((pos) => seatMap[pos])
    .filter((val) => val > 0)
    .reduce((acc, curr) => {
        return acc + curr;
    }, 0);
}

function getVisibleSeats(seatMap, position) {
    const result = new Array();
    const coordinate = translatePosition(position);

    translations = [
        {x: -1, y: -1},
        {x: 0, y: -1},
        {x: 1, y: -1},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 0, y: 1},
        {x: -1, y: 1},
        {x: -1, y: 0}
    ];
    
    translations.forEach ((t) => {

        let sightLength = 1;
        let foundEndOrStop = false;

        while (!foundEndOrStop) {
            const translatedCoord = {
                x: coordinate.x + t.x * sightLength,
                y: coordinate.y + t.y * sightLength
            }

            const toPosition = translateCoordinate(translatedCoord);

            if ((toPosition >= 0 && toPosition < seatMap.length) &&
                (translatedCoord.x >= 0 && translatedCoord.y >= 0) &&
                (translatedCoord.x < width))  {
                result.push(toPosition);

                if (seatMap[toPosition] > -1) {
                    foundEndOrStop = true;
                }
            } else {
                foundEndOrStop = true;
            }

            sightLength++;
        }
    });

    return result;
}

function getNoofAdjacentSeatsTaken(seatMap, position) {
    const adjSeats = getAdjacentSeats(seatMap, position);

    return adjSeats.map((pos) => seatMap[pos])
    .filter((val) => val > 0)
    .reduce((acc, curr) => {
        return acc + curr;
    }, 0);
}

function getAdjacentSeats(seatMap, position) {
    const result = new Array();
    const coordinate = translatePosition(position);

    translations = [
        {x: -1, y: -1},
        {x: 0, y: -1},
        {x: 1, y: -1},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 0, y: 1},
        {x: -1, y: 1},
        {x: -1, y: 0}
    ];
    
    translations.forEach ((t) => {
        const translatedCoord = {
            x: coordinate.x + t.x,
            y: coordinate.y + t.y
        }

        const toPosition = translateCoordinate(translatedCoord);
        if ((toPosition >= 0 && toPosition < seatMap.length) &&
            (translatedCoord.x >= 0 && translatedCoord.y >= 0) &&
            (translatedCoord.x < width))  {
            result.push(toPosition);
        }

    });

    return result;
}

function countSeatsTaken(seatMap) {
    return seatMap.filter((s) => s > 0).reduce((acc, val) => acc+val, 0);
}

const equals = (a, b) =>
  a.length === b.length &&
  a.every((v, i) => v === b[i]);

function simulateTillStablePart1() {
    let lastSeating = seats;
    let isStable = false;
    while (!isStable) {
        const newSeatings = simulateOneRoundPart1(lastSeating);
        isStable = equals(lastSeating, newSeatings);
        lastSeating = newSeatings;
    }

    return lastSeating;
}

function simulateOneRoundPart1(seatMap) {

    const newSeating = seatMap.map((val, ix, arr) => {
        if (val === 0 && getNoofAdjacentSeatsTaken(arr, ix) === 0)
            return 1;

        if (val === 1 && getNoofAdjacentSeatsTaken(arr, ix) > 3)
            return 0;

        return val;
    });

    return newSeating;
}

function simulateTillStablePart2() {
    let lastSeating = seats;
    let isStable = false;
    while (!isStable) {
        const newSeatings = simulateOneRoundPart2(lastSeating);
        isStable = equals(lastSeating, newSeatings);
        lastSeating = newSeatings;
    }

    return lastSeating;
}

function simulateOneRoundPart2(seatMap) {

    const newSeating = seatMap.map((val, ix, arr) => {
        if (val === 0 && getNoofVisibleSeatsTaken(arr, ix) === 0)
            return 1;

        if (val === 1 && getNoofVisibleSeatsTaken(arr, ix) > 4)
            return 0;

        return val;
    });

    return newSeating;
}

async function main() {
  await processLineByLine();
  
  /*
  console.log(getVisibleSeats(seats, translateCoordinate({x: 3, y: 4})).map(translatePosition));
  console.log(getNoofVisibleSeatsTaken(seats, translateCoordinate({x: 3, y: 3})));
  
  console.log(width);
  console.log(seats);
  console.log(getAdjacentSeats(seats, translateCoordinate({x: 0, y: 0})).map(translatePosition));
  console.log(getNoofAdjacentSeatsTaken(0));
  console.log('seats taken', countSeatsTaken(seats));
  */ 

  const stableSeatings1 = simulateTillStablePart1();
  console.log('seats taken part 1', countSeatsTaken(stableSeatings1));


  const sT = new Date();
  const stableSeatings2 = simulateTillStablePart2();
  console.log('part 2 took:', new Date() - sT);
  console.log('seats taken part 2', countSeatsTaken(stableSeatings2));
}
main();
