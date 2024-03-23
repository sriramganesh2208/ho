import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Existing register function for traditional registration
export const register = async (req, res) => {
  try {
    // Destructure required properties from request body
    const { Username, email, password } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ Username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user instance
    const newUser = new User({
      Username,
      email,
      password: hashedPassword
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    // Handle any errors
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
};

// New function for registering users with Google authentication
export const registerWithGoogle = async (req, res, next) => {
  try {
    const { tokenId } = req.body; // Extract the Google authentication token

    // Decode the token or verify it using a library like `google-auth-library`
    // For simplicity, let's assume the token contains the user's email and other necessary information

    // Check if the user already exists based on the email received from Google authentication
    const { email } = decodedToken; // Replace `decodedToken` with the actual decoded token or verified user information
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user using the information received from Google authentication
    const newUser = new User({
      email, // Use the email received from Google
      // You can include additional user data here if needed
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "User registered successfully with Google" });
  } catch (err) {
    // Handle any errors
    console.error("Error registering user with Google:", err);
    res.status(500).json({ error: "Failed to register user with Google" });
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body; // Change 'username' to 'email' here

    const user = await User.findOne({ email }); // Change 'username' to 'email' here
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong email or password!")); // Update error message

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password: userPassword, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};
