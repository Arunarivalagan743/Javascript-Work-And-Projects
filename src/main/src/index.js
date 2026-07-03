const n = [1,5,3];
const l = ["arun","balu","car","arun"];
const obj = {
    name  : "arun",
    age  : 12
}
const {name} =  obj;
console.log(name);

n.forEach(element => {
 console.log(element);   
});

const  res  = l.map((e)=> e +"rr");
console.log(res);

const fil =  l.sort((a,b)=>b-a);
console.log(fil);
n.shift();
n.unshift(45,"arun");
n.shift();
console.log(n.toReversed());
console.log(n);

const s  =  n.every((e)=> e%2  == 1 )
console.log(s);

