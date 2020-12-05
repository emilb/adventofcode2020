const fs = require('fs');
const { prependOnceListener } = require('process');
const readline = require('readline');

let counterValidPassports = 0;

async function processLineByLine() {
  const fileStream = fs.createReadStream('data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currData = '';

  for await (const line of rl) {
    if (line.length === 0) {
      if (validatePassportDataStep2(currData)) {
        console.log(currData)

        counterValidPassports++;
      }
      currData = '';
    } else {
      currData = currData + ' ' + line;
    }
  }
}

function validatePassportDataStep1(data) {
  return data.includes('byr') && data.includes('iyr') && data.includes('eyr') && data.includes('hgt') && data.includes('hcl') && data.includes('ecl') && data.includes('pid');
}

function validatePassportDataStep2(data) {
  if (data.includes('byr') && data.includes('iyr') && data.includes('eyr') && data.includes('hgt') && data.includes('hcl') && data.includes('ecl') && data.includes('pid')) {
    // byr
    const byr = parseInt(getDataAfter('byr', data));
    if (byr < 1920 || byr > 2002)
      return false;

    // iyr
    const iyr = parseInt(getDataAfter('iyr', data));
    if (iyr < 2010 || iyr > 2020)
      return false;

    // eyr
    const eyr = parseInt(getDataAfter('eyr', data));
    if (eyr < 2020 || eyr > 2030)
      return false;

    // hgt
    const hgt = getDataAfter('hgt', data);
    const hgtNum = parseInt(hgt.substring(0, hgt.length-2));
    if (hgt.endsWith('in')) {
      if (hgtNum < 59 || hgtNum > 76)
        return false;
    } else if (hgt.endsWith('cm')) {
      if (hgtNum < 150 || hgtNum > 193)
        return false;
    } else {
      return false;
    }

    // hcl
    const hcl = getDataAfter('hcl', data);
    if (!hcl.match(/^#[0-9a-f]{6}/))
      return false;

    // ecl
    const ecl = getDataAfter('ecl', data);
    if (!(ecl === 'amb' || ecl === 'blu' || ecl === 'brn' || ecl === 'gry' || ecl === 'grn' || ecl === 'hzl' || ecl === 'oth'))
      return false;

    // pid
    const pid = getDataAfter('pid', data);
    if (!pid.match(/\d{9}/))
      return false;


    return true;
  } else {
    return false;
  }
  
}

function getDataAfter(keyword, data) {
   const pos = data.indexOf(keyword);
   let complete = false;
   let value = '';
   let counter = pos+4;

   while (!complete) {
    let c = data[counter];

    value += c;
    counter++;

    if (counter >= data.length)
      complete = true;
    else if (data[counter] === ' ')
      complete = true;
   }

   return value;
}

async function main() {
  await processLineByLine();
  console.log(counterValidPassports);
}

main();

/*
byr (Birth Year)
iyr (Issue Year)
eyr (Expiration Year)
hgt (Height)
hcl (Hair Color)
ecl (Eye Color)
pid (Passport ID)
cid (Country ID)
*/