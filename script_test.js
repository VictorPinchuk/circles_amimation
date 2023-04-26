let obj = {};

function setObj(objInner) {
    // const objInner = {};
    objInner.x = 5;
    setY(objInner);
    return objInner;
}
const obj1 = structuredClone(setObj(obj));
console.log(obj1.z.old);


function setY(object) {
    object.y = 10;
    
    object.z = {old: undefined, new: undefined};
    obj.z.new = 'new new';
    // object.z.new = 'new';
}

