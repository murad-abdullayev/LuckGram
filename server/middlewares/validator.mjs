import { checkSchema, validationResult, matchedData } from "express-validator";

export default function validateSchema(schema) {
  return async (req, res, next) => {
    await checkSchema(schema).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.matchedData = matchedData(req);
    next();
  };
}
