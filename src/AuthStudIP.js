import {AuthConnector} from "nsfw-api";

const base64 = require("base-64");
const fetch = require('node-fetch');
global.Headers = fetch.Headers;

/**
 * A StudIP Authenticator for the NSFW-API  https://www.npmjs.com/package/nsfw-api
 */
export default class AuthStudIP {
    static PERM_DOZENT = "dozent";
    static PERM_TUTOR = "tutor";
    static PERM_STUDENT = "student";
    static PERM_GUEST = "guest";

    static AUTH_METHOD = "StudIP";
    static AUTH_NAME = "StudIP";
    static STUDIP_URL = 'https://studip.uni-osnabrueck.de/api.php/user/';

    static roleMapping = {
        [AuthStudIP.PERM_DOZENT] : "admin",
        [AuthStudIP.PERM_TUTOR] : "moderator",
        [AuthStudIP.PERM_STUDENT] : "user",
        [AuthStudIP.PERM_GUEST]: "guest"
    }

    static setRoleMapping(roleOfDozent, roleOfTutor, roleOfStudent){
        AuthStudIP.roleMapping[AuthStudIP.PERM_DOZENT] = roleOfDozent;
        AuthStudIP.roleMapping[AuthStudIP.PERM_TUTOR] = roleOfTutor;
        AuthStudIP.roleMapping[AuthStudIP.PERM_STUDENT] = roleOfStudent;
    }

    static PARAM_USERNAME = "username";
    static PARAM_PASSWORD = "password";

    static getNeededAuthParams(){
        return {
            name: AuthStudIP.AUTH_NAME,
            params: {
                [AuthStudIP.PARAM_USERNAME] : "xmuster",
                [AuthStudIP.PARAM_PASSWORD]: "password",
            }
        }
    }

    static getRole(perms){
        let roleMapping = AuthStudIP.roleMapping
        if(!!roleMapping[perms]){
            return roleMapping[perms]
        } else {
            return roleMapping[AuthStudIP.PERM_GUEST];
        }
    }

    /**
     *
     * @param authObject will have allNeededAuthParams
     * @returns {Promise<unknown>}
     */
    static async authorize(authObject){
        console.log("AuthMyUOS authorize");
        let username = authObject[AuthStudIP.PARAM_USERNAME];
        let password = authObject[AuthStudIP.PARAM_PASSWORD];

        try {
            let user = await AuthStudIP.authorizeAtStudIP(username,password)
            let name = user.name;
            let displayName = name.given; //firstname or name.formated for fullname including title
            let perms = user.perms;

            let role = AuthStudIP.getRole(perms);

            let additionalInformation = null; // additionalInformation = user; but was a bit overkill i think
            return AuthConnector.getSuccessMessage(AuthStudIP.AUTH_METHOD, role, username, displayName, additionalInformation);
        } catch (error) {
            console.log(error);
            return AuthConnector.getError(AuthConnector.ERROR_CREDENTIALS_INCORRECT);
        }
    }

    static async authorizeAtStudIP(username, password) {
        let headers = new Headers();

        headers.append('Content-Type', 'text/json');
        headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));

        return new Promise(async (resolve, reject) => {
            try {
                let response = await fetch(AuthStudIP.STUDIP_URL, {
                    method: 'GET',
                    headers: headers,
                });

                let user = await response.json();
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }
}
