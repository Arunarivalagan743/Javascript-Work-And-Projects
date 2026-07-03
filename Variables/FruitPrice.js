var FruitName = "Apple";
var count = 3;
var Price = 230;
var total = count * Price;
console.log(FruitName);
console.log("Total price of the fruit is ",total)

// var  --> is used as global scope it can be accessed in anywhere

// let --> is used as global scope as used in only as scope 
//  {
// let num = 10;
// console.log(num)
// }
// console.log(num) --> error

// const --> is used for constant value

let a =[1,2,3,45];
let b  =  [34,5,6,6];
console.log(typeof (a+b));
function ex()
{
    if(true)
    {
        var c =  3;
        console.log(c);
    }
    console.log(c);
}
ex();