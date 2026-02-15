import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import passport from "../lib/passport.js";
import { generateToken } from "../lib/generatetoken.js";


export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      city,
      pincode,
      latitude,
      longitude,
      photo
    } = req.body;

    // 🔹 Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    // 🔹 Validate role safely
    const finalRole =
      role === "GROOMER" ? "GROOMER" : "USER";

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.$transaction(async (tx) => {

        const createdUser = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: finalRole,
            phone,
            city,
            pincode,
            latitude,
            longitude,
            photo
          }
        });

      const allowedRoles = ["USER", "GROOMER","ADMIN"];

        if (role && !allowedRoles.includes(role)) {
          return res.status(400).json({
            success: false,
            message: "Invalid role provided"
          });
        }

        if (finalRole === "GROOMER") {
          await tx.groomer.create({
            data: {
              userId: createdUser.id,
              isVerified: false,
              verificationStatus: "pending",
              rating: 0,
              totalReviews: 0
            }
          });
        }
        return createdUser;
        
      });
      const token =generateToken(newUser);
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        photo: newUser.photo,
        phone: newUser.phone,
        city: newUser.city,
        pincode: newUser.pincode,
        latitude: newUser.latitude,
        longitude: newUser.longitude,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
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



