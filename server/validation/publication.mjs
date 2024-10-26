export const createPostSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title must be a string",
    },
    notEmpty: {
      errorMessage: "Title is required",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Description must be a string",
    },
    notEmpty: {
      errorMessage: "Description is required",
    },
    isLength: {
      options: { min: 10 },
      errorMessage: "Description must be at least 10 characters long",
    },
  },
  tags: {
    in: ["body"],
    isString: {
      errorMessage: "Tags must be a string",
    },
    notEmpty: {
      errorMessage: "Tags are required",
    },
  },
};

export const updatePostSchema = {
  title: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Title must be a string",
    },
    notEmpty: {
      errorMessage: "Title is required",
    },
  },
  description: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Description must be a string",
    },
    isLength: {
      options: { min: 10 },
      errorMessage: "Description must be at least 10 characters long",
    },
  },
  tags: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Tags must be a string",
    },
    notEmpty: {
      errorMessage: "Tags are required",
    },
  },
};
