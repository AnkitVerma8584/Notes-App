import {User} from "../models/user";

async function fetchData(input:RequestInfo, init?:RequestInit){

    const response = await fetch(input,init);

    if(response.ok){
        return response
    }else{
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}

export async function getLoggedInUser() : Promise<User> {
    const response = await fetchData("/api/users",{method:"GET"});
    return response.json();
}

interface SignUpCredentials{
    username:string,
    email:string,
    password:string
}

export async function signUp(creds:SignUpCredentials) : Promise<User>{
    const response = await fetchData("/api/users/signup",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(creds)
    });

    return response.json();
}

interface LoginCredentials{
    username:string,
    email:string
}

export async function login(creds:LoginCredentials) : Promise<User>{
    const response = await fetchData("/api/users/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(creds)
    });

    return response.json();
}

export async function logoutin(){
    await fetchData("/api/users/logout",{method:"POST"});
}