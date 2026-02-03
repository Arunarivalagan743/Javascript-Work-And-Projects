const arr = ["arun", "hari", "la"];
// const brr = [...arr];
// arr.push("kasj")
// // console.log(brr);
// const obj  = {
//     name :"arun",
//     age : "13"
// }
// // kr(arr);
// // console.log({...obj})
// let  kr = (...brr)=>
// {
//     console.log(brr[0]);
// }
// kr(brr);

console.log(
  arr.filter((val) => {
    return val == "arun";
  }),
);
console.log(
  arr.map((val) => {
    return val + "a";
  }),
);
