import { User } from "../models/User.ts";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//register user

const register = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    const existingEmail = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    if (existingEmail) {
      return res.status(400).send("Email already used");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (error: unknown) {
    res.status(400).send(error);
  }
};
