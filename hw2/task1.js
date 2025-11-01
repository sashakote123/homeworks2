//просто три уровня замыкания
function f1(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}


//запись покороче
let f2 = (a) => (b) => (c) => a + b + c;


//с любым уровнем вложенности, но нужно применять valueOf()
function f3(initialValue) {
  let currentSum = initialValue;
  
  function f(nextValue) {
    currentSum += nextValue;
    return f;
  }
  
  f.valueOf = () => currentSum;
  f.toString = () => currentSum.toString();
  
  return f;
}


//через создание экземпляра функции, в которой задана глубина вложенности
function f4(targetCount) {
  return function inner(...args) {
    if (args.length >= targetCount) {
      return args.reduce((sum, num) => sum + num, 0);
    }
    
    return function(...nextArgs) {
      return inner(...args, ...nextArgs);
    };
  };
}


console.log(f1(2)(3)(5));
console.log(f2(2)(3)(5));
console.log(f3(2)(3)(5)(10)(25).valueOf());

const sum = f4(3);
console.log(sum(1)(2)(3));

const sum2 = f4(5);
console.log(sum2(1)(2)(3)(2)(3));

const sum3 = f4(7);
console.log(sum3(1)(2)(3)(2)(3)(2)(3));

