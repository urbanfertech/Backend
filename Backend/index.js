
import express from "express";
import "dotenv/config";
import prismaPkg from "@prisma/client";
import userroutes from "./routes/user.routes.js";
const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use("/accounts",userroutes);
app.get("/test", async (req, res) => {
  const user = await prisma.user.create({
    data: { name: "Sohel" }
  });
  res.json(user);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
