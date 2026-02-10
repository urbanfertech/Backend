import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
export const signup = async(req, res) => {
  const data=req.body;
  if(data.password)
    data.password=bcrypt.hashSync(data.password,10);
  else
    data.password="";
  const user =await  prisma.user.create({
    data: data,
  })
  res.status(201).json({data:user,message:"User created successfully"});
};

export const login = async(req, res) => {
  const data=req.body;
//   console.log(data);
  const user =await  prisma.user.findUnique({
    where: {
      email: data.email,
    },
  })
//   console.log(user);    
   if(!user)
    return res.json({message:"User not found"}).status(404).send({message:"User not found"});
  const isPasswordCorrect=bcrypt.compareSync(data.password,user.password);
  if(!isPasswordCorrect && data.password && user.password)
    return res.status(401).json({message:"Password is incorrect"})

  res.status(200).json({data:user,message:"User logged in successfully"})
}