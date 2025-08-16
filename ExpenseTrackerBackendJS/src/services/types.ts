export interface UserRegisterRequest {
    username:string;
    birthDate:string;
    email:string;
    password:string;
    gender:string;
}

export interface UserData{
    userId:string;
    userDisplayName:string;
    userEmail:string;
    userGender:string;
    userAge:number;
    userBirthDate:string;
    userCreatedAt:string;
    userUpdatedAt:string;
    userPassword:string;
    userAccounts:Account[];
}


export interface Account{
    accountId:string;
    accountName:string;
    userId:string;
    monthlyIncome:number;
    accountBalance:number;
    accountStatus:string;
}