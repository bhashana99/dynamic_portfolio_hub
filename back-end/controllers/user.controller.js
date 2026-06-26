import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const registerUser = async (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("User created successfully!!");
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const validUser = await User.findOne({ username });
    if (!validUser) return await next(errorHandler(404, "User not found!!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credential!"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      // Same-origin via the Vercel proxy, so SameSite=Lax works in prod and dev.
      // If prod login ever fails, switch to { secure: true, sameSite: "none" }.
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const { username } = req.params;

  if (newPassword !== confirmPassword) {
    return next(errorHandler(400, "Password does not match!"));
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    const validPassword = bcryptjs.compareSync(currentPassword, user.password);
    if (!validPassword) {
      return next(errorHandler(401, "Current Password is incorrect!"));
    }

    const hashedNewPassword = bcryptjs.hashSync(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json("Password has been changed successfully!");
  } catch (error) {
    next(error);
  }
};
