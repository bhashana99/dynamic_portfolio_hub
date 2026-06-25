import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import basicInfoRouter from "./routes/basicInfo.route.js";
import socialMediaRouter from "./routes/socialMedia.route.js";
import contactInfoRouter from "./routes/contact.route.js";
import projectRouter from "./routes/project.route.js";
import educationRouter from "./routes/education.route.js";
import certificateRouter from "./routes/certificate.route.js";
import workRouter from "./routes/work.route.js";
import uploadRouter from "./routes/upload.route.js";
import path from "path";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/basicInfo", basicInfoRouter);
app.use("/api/socialMedia", socialMediaRouter);
app.use("/api/contactInfo", contactInfoRouter);
app.use("/api/project", projectRouter);
app.use("/api/education", educationRouter);
app.use("/api/certificate", certificateRouter);
app.use("/api/work", workRouter);
app.use("/api/upload", uploadRouter);

app.use(express.static(path.join(__dirname, "/front-end/dist")));

app.get("*", (req, res) =>{
  res.sendFile(path.join(__dirname, "/front-end/dist/index.html"))
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
