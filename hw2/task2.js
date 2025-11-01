const str = 'one.two.three.four.five';

//со встроенной функцией reduceRight
function stringToObj1(path) {
  const keys = path.split('.');
  return keys.reduceRight((acc, key) => ({ [key]: acc }), {});
}

//обычным циклом
function stringToObj2(path) {
  const keys = path.split('.');
  let result = {};
  let current = result;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    current[key] = {};
    current = current[key];
  }

  return result;
}

console.log(stringToObj1(str));
console.log(stringToObj2(str));