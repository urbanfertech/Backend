
import express from "express";
import "dotenv/config";
import prismaPkg from "@prisma/client";
import passport from "./lib/passport.js";
import authRoutes from "./routes/auth.routes.js";
import groomerRoutes from "./routes/groomer.routes.js";
import userRoutes from "./routes/user.routes.js";
import petRoutes from "./routes/pet.routes.js";
import searchRoutes from "./routes/search.routes.js";

const app = express();
app.use(passport.initialize());
app.use(express.json());
app.use("/accounts",authRoutes);
app.use("/groomers", groomerRoutes);
app.use("/users", userRoutes);
app.use("/user/pets",petRoutes);
app.use("/search", searchRoutes);
app.get("/test", async (req, res) => {
  const user = await prisma.user.create({
    data: { name: "Sohel" }
  });
  res.json(user);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
