import { rateLimit } from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5, // limit each ip to 5 login per window per min
  message: {
    message: "Too many login attempts, please try again after 60 seconds",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default loginLimiter;
