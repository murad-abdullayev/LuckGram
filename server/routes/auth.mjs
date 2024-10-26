import { Router } from "express";
import validateSchema from "../middlewares/validator.mjs";
import User from "../mongoose/schemas/user.mjs";
import {
  forgotPasswordSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validation/auth.mjs";
import { hashPassword } from "../utils/bcrypt.mjs";
import { authenticate, authorize } from "../middlewares/user.mjs";
import crypto from "crypto";
import { transporter } from "../utils/mail.mjs";

const router = Router();

router.post("/login", authenticate, (req, res) => {
  req.session.save((err) => {
    if (err) {
      return res.status(500).json({ message: "Login failed" });
    }
    res.cookie("connect.sid", req.sessionID, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.json({
      message: "Login successful",
      user: req.user,
    });
  });
});

router.post("/register", validateSchema(registerSchema), async (req, res) => {
  const user = req.matchedData;
  user.password = hashPassword(user.password);
  const userExist = await User.findOne({
    email: user.email,
  });

  if (userExist) {
    return res.status(400).json({
      message: "User already exists with this email",
    });
  }

  const newUser = new User(user);
  await newUser.save();

  const userObj = newUser.toObject();
  delete userObj.password;
  delete userObj.__v;

  res.json({
    message: "Register successful",
    user: userObj,
  });
});

router.post("/logout", (req, res) => {
  req.logOut((error) => {
    if (error) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  });
  res.json({
    message: "Logout successful",
  });
});

router.get("/current-user", authorize({ isAdmin: false }), async (req, res) => {
  try {
    let user = req.user;

    if (req.query.includePosts === "true") {
      user = await User.findById(user._id)
        .select("-password -__v")
        .populate("publications");
    }

    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching current user", error });
  }
});

router.get("/all-users", authorize({ isAdmin: false }), async (req, res) => {
  try {
    let usersQuery = User.find({}, "-password -__v");

    if (req.query.includePosts === "true") {
      usersQuery = usersQuery.populate("publications");
    }

    const users = await usersQuery.exec();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

router.post(
  "/forgot-password",
  validateSchema(forgotPasswordSchema),
  async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found with this email",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #16A34A; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 26px; font-weight: bold; margin: 10px 0;">Password Reset Request</h1>
          </div>

          <div style="padding: 20px;">
            <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
              Hello,
            </p>
            <p style="color: #333333; font-size: 16px; line-height: 1.6;">
              You recently requested to reset your password for your <strong>LuckGram</strong> account. To proceed, please click the button below. This link will be active for the next 60 minutes.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/reset-password/${token}" 
                style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; background-color: #16A34A; border-radius: 5px; text-decoration: none; font-weight: bold;">
                Reset Your Password
              </a>
            </div>
            
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-top: 20px;">
              If you didn’t request this, you can safely ignore this email. Rest assured, your account is secure.
            </p>
          </div>

          <div style="background-color: #f9fafb; padding: 15px; color: #555555; font-size: 14px; text-align: center;">
            <p style="margin: 0;">Need more help? <a href="http://localhost:5173/support" style="color: #16A34A; text-decoration: none;">Contact Support</a></p>
          </div>
          
          <div style="background-color: #f4f4f9; padding: 10px; text-align: center; color: #777777; font-size: 12px;">
            <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
            <p><a href="http://localhost:5173/reset-password/${token}" style="color: #16A34A;">http://localhost:5173/reset-password/${token}</a></p>
          </div>
        </div>
      </div>`;

    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = Date.now() + 3600000;
    await user.save();
    transporter.sendMail({
      from: '"LuckGram" <abdulllaev.murad@gmail.com>',
      to: email,
      subject: "Reset Your Password",
      html: emailHtml,
      priority: "high",
    });
    res.json({
      message: "Email sent",
    });
  }
);

router.post(
  "/reset-password/:token",
  validateSchema(resetPasswordSchema),
  async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = hashPassword(password);
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpires = null;
    await user.save();

    res.json({
      message: "Password reset successful",
    });
  }
);

export default router;
