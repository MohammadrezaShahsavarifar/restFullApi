const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    data: users,
    message: "ok",
  });
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid Id");
  }
  const user = await User.findById(req.params.id);
  if (user) {
    res.status(200).json({
      data: user,
      message: "ok",
    });
  } else if (!user) {
    return res.status(404).json({
      data: null,
      message: "the user not found",
    });
  }
});

router.post("/", [body("email", "email must be valid").isEmail(), body("first_name", "firstName not foubd").notEmpty(), body("last_name", "last name nout found").notEmpty()], async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json({
      data: null,
      errors: errors.array(),
      message: "validation not found",
    });
  }
  let newUser = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
  });
  newUser = await newUser.save();
  res.status(200).json({
    data: newUser,
    message: "ok",
  });
});

router.put("/:id", [body("email", "email must be valid").isEmail(), body("first_name", "firstName not foubd").notEmpty(), body("last_name", "last name nout found").notEmpty()], async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
      },
      { new: true }
    );

    res.status(200).json({
      data: user,
      message: "ok",
    });
  } catch (exp) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).json({
        data: null,
        errors: errors.array(),
        message: "validation not found",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (user) {
    res.status(200).json({
      data: user,
      message: "ok",
    });
  } else if (!user) {
    res.status(404).json({
      data: null,
      message: "user not found",
    });
  }
});

module.exports = router;
