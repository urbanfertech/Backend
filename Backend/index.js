import http from "http";
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
import communityRoutes from "./routes/community.routes.js";
import { initSocket } from "./config/socket.js";
const app = express();
const server = http.createServer(app);   // attach express to http server

await initSocket(server); 

app.use(passport.initialize());
app.use(express.json());
app.use("/accounts",authRoutes);
app.use("/groomers", groomerRoutes);
app.use("/users", userRoutes);
app.use("/user/pets",petRoutes);
app.use("/search", searchRoutes);
app.use("/services", serviceRoutes);
app.use("/booking",bookinRoutes);
app.use("/community",communityRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:`+process.env.PORT);
});
