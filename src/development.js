import "regenerator-runtime/runtime.js";
import AuthStudIP from "./AuthStudIP";

const credentials = require("./credentials.json");

async function rawInformationLogin(username, password){
    let user = await AuthStudIP.authorizeAtStudIP(username,password);
    console.log(user);
}

async function reducedInformation(username, password){
    let authObject = {
        [AuthStudIP.PARAM_USERNAME]: username,
        [AuthStudIP.PARAM_PASSWORD]: password
    }

    try{
        let answer = await AuthStudIP.authorize(authObject);
        console.log(answer);
    } catch (err){
        console.log("No success");
        console.log(err);
    }
}

async function main(){
    let username = credentials.username;
    let password = credentials.password

    await rawInformationLogin(username, password)
    await reducedInformation(username, password)
}

console.log("Start Test");

main();