import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import  prisma  from "./prisma.js";
import dotenv from "dotenv";
import { generateToken } from "./generatetoken.js";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/accounts/google/callback",
      passReqToCallback: true, 
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        
        const requestedRole = req.query.state || "user";

      // Validate role
        const allowedRoles = ["user", "groomer"];
        const role = allowedRoles.includes(requestedRole)
            ? requestedRole
            : "user";
            let user = await prisma.user.findUnique({
            where: { email }
            });
        
        if (!user) {
            console.log(" "+role);
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              name: profile.displayName,
              email: email,
              photo: profile.photos?.[0]?.value || null,
              role,
              password: null, 
            }
          });
        }

        
       const token=generateToken(user);

        done(null, { user, token });

      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
