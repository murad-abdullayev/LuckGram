export const createCommentSchema = {
  content: {
    in: ["body"],
    isString: {
      errorMessage: "Comment must be a string",
    },
    notEmpty: {
      errorMessage: "Comment is required",
    },
    isLength: {
      options: { min: 10 },
      errorMessage: "Comment must be at least 10 characters long",
    },
  },
};
