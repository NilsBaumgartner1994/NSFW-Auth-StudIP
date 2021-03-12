import "regenerator-runtime/runtime.js";
import AuthStudIP from "./AuthStudIP";

const credentials = require("./credentials.json");

async function main(){
    let authObject = {
        [AuthStudIP.PARAM_USERNAME]: credentials.username,
        [AuthStudIP.PARAM_PASSWORD]: credentials.password
    }

    try{
        let answer = await AuthStudIP.authorize(authObject);
        console.log(answer);
    } catch (err){
        console.log("No success");
        console.log(err);
    }
}

console.log("Start Test");

main();