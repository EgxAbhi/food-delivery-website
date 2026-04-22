import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/UserRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import orderRouter from "./routes/orderRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//app config
const app = express();
const port = process.env.PORT ||4000;

// middleware
app.use(express.json());
// accept urlencoded form submissions (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("API WORKING");
});

//db connection
const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
  //API END-POINTS
  app.use("/api/food", foodRouter);
  app.use("/images", express.static(path.join(__dirname, "uploads")));
  app.use("/api/user", userRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/order", orderRouter);

  app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
  });
};

startServer();

// mongodb://localhost:27017/
