import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
export const signup = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await prisma.user.create({
      data: {
        ...rest,
        password: password
          ? await bcrypt.hash(password, 10)
          : null,
        role: "user",
      },
    });

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
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