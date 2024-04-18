import Express from "express";
import mongoose, { Mongoose } from "mongoose";
import routerStudent from "../routes/student.mjs";
import createError from "http-errors";
import dotenv from "dotenv";
dotenv.config();
const app = Express();
import cors from "cors";
const port = 5500;
app.use(Express.json());
const DatabseURL = process.env.DATABASE_URL;
const conncetToDb = async () => {
  try {
    await mongoose.connect(DatabseURL);
    console.log("Connected to Database");
  } catch (err) {
    console.log(err);
  }
};
conncetToDb();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use("/student", routerStudent);

app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
