
function play(initalValues, noofIterations) {
  let lastValue = initalValues[initalValues.length-1];
  const positions = new Map();

  initalValues.slice(0, initalValues.length-1)
    .forEach((val, ix) => positions.set(val,ix));

  //initalValues.forEach((val, ix) => console.log(ix + ': ' + val));

  let counter = initalValues.length-1;
  while(counter < noofIterations-1) {
    let newValue = -1;

    if (!positions.has(lastValue)) newValue = 0;
    else newValue = counter - positions.get(lastValue);

    positions.set(lastValue, counter);

    counter++;
    lastValue = newValue;
  }

  return lastValue;
}

async function main() {

  console.log(play([16,11,15,0,1,7], 2020));
  console.log(play([16,11,15,0,1,7], 30000000));
}

main();