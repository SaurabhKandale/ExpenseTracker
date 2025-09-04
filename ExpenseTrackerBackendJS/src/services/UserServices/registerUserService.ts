import { Request, Response } from "express";
import { UserData, UserRegisterRequest } from "../../types";
import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";

const calculateAgeFromBirthDate = (birthDate:string):number => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const age = today.getFullYear() - birthDateObj.getFullYear();
    return age;
  }

const checkIfUserExists = async (email:string):Promise<boolean> => {
    const user:UserData | null = await prisma.userData.findUnique({
        where:{
            userEmail:email
        },
        include:{
            userAccounts:true
        }
    });
    return user !== null;
}

const registerUserService = async (request: Request, response: Response) => {
  // TODO: Implement user registration logic here

  const userData:UserRegisterRequest = request.body;

  //basic validation
  if(!userData.email || !userData.password || !userData.username || !userData.gender || !userData.birthDate){
    return response.status(400).json({ message: "Invalid request body" });
  }

  if(await checkIfUserExists(userData.email)){
    return response.status(400).json({ message: "User already exists" });
  }


  const updatedUserData = {
    userEmail:userData.email,
    userGender:userData.gender,
    userPassword:userData.password,
    userAge:calculateAgeFromBirthDate(userData.birthDate),
    userBirthDate:userData.birthDate,
    userCreatedAt:new Date().toISOString(),
    userDisplayName:userData.username,
    userUpdatedAt:new Date().toISOString()
  }

  try{
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await prisma.userData.create({
        data:{
            ...updatedUserData,
            userPassword:hashedPassword
        }
    });
    const {userPassword, ...userDataWithoutPassword} = newUser;
    return response.status(201).json({message:"User created successfully", user:userDataWithoutPassword});

  }catch(error){
    console.log(error);
    return response.status(500).json({message:"Internal server error"});
  }

};

export default registerUserService; 