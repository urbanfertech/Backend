import jwt from "jsonwebtoken";

export const generateToken = (user) => {

  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,  
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "7d",   
    }
  );
};
