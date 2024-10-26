import passport from "passport";

export const authorize = () => (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
};

export const authenticate = (req, res, next) =>
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
    if (!user) {
      return res.status(400).json({
        message: info.message,
      });
    }
    req.logIn(user, (error) => {
      if (error) {
        return res.status(500).json({
          message: err.message,
        });
      }
    });
    next();
  })(req, res, next);
