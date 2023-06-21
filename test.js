console.log("Hello from test.js");

class Person {
  constructor(arr, obj, num=1) {
    this.arr = arr;
    this.obj = obj;
    this.num = num;
  }
  printNum() {
    console.log(this.num);
  }
  changeArr() {
    this.arr.forEach((element) => {
      element.a = "0";
    });
  }
  changeObj() {
    this.obj.x = "z";
  }
}
function clonePerson(persDedault) {
  return Object.assign(new Person(), JSON.parse(JSON.stringify(persDedault)));
}
const personDefault = new Person(
  [
    { a: "a1", b: "b1" },
    { a: "a2", b: "b2" },
    { a: "a3", b: "b3" },
  ],
  { x: "x", y: "y" },
  5
);


console.log("Default before ", personDefault);

// let personNew = new Person();
// console.log("1 New before ", personNew);
const personNew = clonePerson(personDefault);
console.log("2 New before ", personNew);
//====================
personNew.changeArr();
personNew.changeObj();
personNew.num = 4;
//====================

console.log("Default after ", personDefault);
console.log("3 New after ", personNew);
