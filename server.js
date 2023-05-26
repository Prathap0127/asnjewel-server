import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import DBConnect from "./config/dbconect.js";
import authRoute from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoute.js";

import cors from "cors";

//ENV config
dotenv.config();

const app = express();

//db connection

DBConnect();

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", authRoute);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcom to ASN Jewel</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server Listining to ${PORT} on ${process.env.MODE}`);
});
