
import express from "express";
import "dotenv/config";
import prismaPkg from "@prisma/client";
import passport from "./lib/passport.js";
import authRoutes from "./routes/auth.routes.js";
import groomerRoutes from "./routes/groomer.routes.js";
import userRoutes from "./routes/user.routes.js";
import petRoutes from "./routes/pet.routes.js";
import searchRoutes from "./routes/search.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import bookinRoutes from "./routes/booking.route.js";
const app = express();
app.use(passport.initialize());
app.use(express.json());
app.use("/accounts",authRoutes);
app.use("/groomers", groomerRoutes);
app.use("/users", userRoutes);
app.use("/user/pets",petRoutes);
app.use("/search", searchRoutes);
app.use("/services", serviceRoutes);
app.use("/booking",bookinRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:`+process.env.PORT);
});
