const fs = require('fs');
const readline = require('readline');

const map = new Array();

async function processLineByLine() {
  const fileStream = fs.createReadStream('data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    map.push(line);
  }
}

function isTreeAt(x, y) {
  const dMap = map[y];
  rX = x % dMap.length;
  
  return dMap[rX] === '#';
}

function countTreesHit(dx, dy) {
  let currX = 0;
  let currY = 0;
  let noofTrees = 0;

  while (currY < map.length-dy) {
    currX += dx;
    currY += dy;
    if (isTreeAt(currX, currY)) {
      noofTrees++;
    }
  }

  return noofTrees;
}

async function main() {
  await processLineByLine();
  
  const r1d1 = countTreesHit(1,1);
  const r3d1 = countTreesHit(3,1);
  const r5d1 = countTreesHit(4,1);
  const r7d1 = countTreesHit(7,1);
  const r1d2 = countTreesHit(1,2);

  console.log('Right 1, down 1:', r1d1);
  console.log('Right 3, down 1:', r3d1);
  console.log('Right 5, down 1:', r5d1);
  console.log('Right 7, down 1:', r7d1);
  console.log('Right 1, down 2:', r1d2);

  console.log('Product: ', r1d1 * r3d1 * r5d1 * r7d1 * r1d2);


}

main();