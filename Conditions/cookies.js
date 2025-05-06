function cookie(cookieLeft)
{
if(cookieLeft)
{
    return "Would u like a cookie";
}
else{
    return "Time to bake more cookies"
}
}




var cookieLeft = false;
var result = cookie(cookieLeft);
console.log("Result : ",result)