import express from "express";
import createError from "http-errors";
import student from "../models/core.model.mjs";
import mongoose from "mongoose";

const routerStudent = express.Router();

routerStudent.get("/", async (req, res) => {
  try {
    const students = await student.find();
    res.status(200);
    res.send(students);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

routerStudent.post("/", async (req, res, next) => {
  console.log(req.body);
  try {
    const studentNew = new student(req.body);
    const stu = await studentNew.save();

    res.status(200);
    res.send("Successfully Inserted Student");
  } catch (err) {
    if (err.name === "ValidationError") {
      next(createError(422, err.message));
      return;
    }
    next(err);
  }
});

routerStudent.delete("/", async (req, res, next) => {
  const regNo = req.params.reg;
  try {
    const result = await student.deleteMany();
    res.send("All Data Deleted");
    res.status(200);
  } catch (err) {
    if (err instanceof mongoose.CastError) {
      next(createError(400, "Invalid Students Registration Number"));
      return;
    }
    next(err);
  }
});

routerStudent.get("/:reg", async (req, res, next) => {
  const regNo = req.params.reg;

  try {
    const stu = await student.findOne({ regNo: regNo });
    if (!stu) {
      throw createError(404, "Student is not registered");
    }
    res.status(200);
    res.send(stu);
  } catch (err) {
    if (err instanceof mongoose.CastError) {
      next(createError(400, "Invalid Students Registration Number"));
      return;
    }
    next(err);
  }
});

routerStudent.delete("/:reg", async (req, res, next) => {
  const regNo = req.params.reg;
  try {
    const result = await student.findOneAndDelete({ regNo: regNo });
    if (!result) {
      throw createError(404, "Student is not registered");
    }
    res.send(result);
    res.status(200);
  } catch (err) {
    if (err instanceof mongoose.CastError) {
      next(createError(400, "Invalid Students Registration Number"));
      return;
    }
    next(err);
  }
});

routerStudent.patch("/:reg", async (req, res, next) => {
  try {
    const regNo = req.params.reg;
    const updateOps = req.body;

    const filteredOps = {};
    for (const key in updateOps) {
      if (updateOps[key] !== "") {
        filteredOps[key] = updateOps[key];
      }
    }
    const options = { new: true };
    const result = await student.findOneAndUpdate(
      { regNo: regNo },
      filteredOps,
      options
    );
    if (!result) {
      throw createError(404, "Student is not registered");
    }
    res.status(200).send(result);
  } catch (err) {
    if (err instanceof mongoose.CastError) {
      return next(createError(400, "Invalid Student ID"));
    }
    next(err);
  }
});

export default routerStudent;
