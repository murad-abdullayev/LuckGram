import passport from "passport";
import Strategy from "passport-local";
import User from "../mongoose/schemas/user.mjs";
import { comparePasswords } from "../utils/bcrypt.mjs";

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);

  if (!user) {
    return done(new Error("User not found"));
  }

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;

  done(null, userObj);
});

export default passport.use(
  new Strategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({
        email,
      });
      if (!user || !comparePasswords(password, user.password)) {
        return done(null, false, {
          message: "Invalid email or password",
        });
      }

      //   if (user.blocked) {
      //     return done(null, false, {
      //       message: "Your account has been blocked. Please contact support.",
      //     });
      //   }

      const userObj = user.toObject();
      delete userObj.password;
      delete userObj.__v;

      done(null, user);
    } catch (error) {
      done();
    }
  })
);
