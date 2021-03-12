import "regenerator-runtime/runtime.js";
import AuthStudIP from "./AuthStudIP";

const USERNAME = "xmuster";
const PASSWORD = "xpassword";

async function main(){
    let authObject = {
        [AuthStudIP.PARAM_USERNAME]: USERNAME,
        [AuthStudIP.PARAM_PASSWORD]: PASSWORD
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