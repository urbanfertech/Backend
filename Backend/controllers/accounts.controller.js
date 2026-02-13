import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import passport from "../lib/passport.js";
import { generateToken } from "../lib/generatetoken.js";
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
    const token = generateToken(user);
    res.status(201).json({
      message: "User created successfully",
      data: user,
      token,
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
  const token=generateToken(user);
  res.status(200).json({data:user,message:"User logged in successfully",token});
}

export const googleLogin = (req, res, next) => {
  const role = req.query.role || "user";
  
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: role,  
  })(req, res, next);
};


export const googleCallback = [
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { user, token } = req.user;

    return res.json({
      message: "Login Successful",
      user,
      token,
    });
  },
];



export const setPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    return res.json({ message: "Password set successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
