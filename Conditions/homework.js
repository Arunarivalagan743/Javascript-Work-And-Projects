function finishHomework(output){
    if(output)
    {
       return "Great Job";
    }
    else{
        return"Finish your homeowrk";
    }
}
var output = true;
var fincHome = finishHomework(output)
console.log("Result: ",fincHome) 