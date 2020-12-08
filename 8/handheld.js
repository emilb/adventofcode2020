const fs = require('fs');
const { prependOnceListener } = require('process');
const readline = require('readline');

const instructions = new Array();
const visited = new Array();

async function processLineByLine() {
  const fileStream = fs.createReadStream('data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    instructions.push(parseInstruction(line));
  }
}

function parseInstruction(line) {
  const splitted = line.split(' ');
  return {
    instruction: splitted[0],
    value: parseInt(splitted[1])
  };
}

function execute(acc, pointer, visited) {
  const exc = instructions[pointer];
  if (visited[pointer] || pointer === instructions.length) {
    return {
      acc, 
      pointer
    };
  }

  visited[pointer] = true;

  switch (exc.instruction) {
    case 'nop':
      pointer += 1;
      break;
    
    case 'acc':
      acc += exc.value;
      pointer += 1;
      break;

    case 'jmp':
      pointer += exc.value;
      break;
  }

  return execute(acc, pointer, visited);
}

function mutate(exc) {
  if (exc.instruction === 'jmp') {
    exc.instruction = 'nop';
  } else if (exc.instruction === 'nop') {
    exc.instruction = 'jmp';
  }

  return exc;
}

function findMutation() {
  for (mutationPos = 0; mutationPos < instructions.length; mutationPos++) {
    const exc = instructions[mutationPos];
    if (exc.instruction === 'acc')
      continue;

    mutate(exc);

    const returnVal = execute(0,0,[]);

    if (returnVal.pointer === instructions.length)
      return returnVal;

    mutate(exc);
  }
}

function willTerminateProperly(instructions) {

}

async function main() {
  await processLineByLine();
  //console.log(instructions);
  console.log(execute(0,0, []));
  console.log(findMutation());
}

main();
