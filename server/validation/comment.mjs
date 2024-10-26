export const createCommentSchema = {
  content: {
    in: ["body"],
    isString: {
      errorMessage: "Comment must be a string",
    },
    notEmpty: {
      errorMessage: "Comment is required",
    },
  },
};
