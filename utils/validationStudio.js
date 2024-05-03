const createStudioValidation = {
   name: {
      notEmpty: {
         errorMessage: "login cannot be empty",
      },
      isString: {
         errorMessage: "login must be a string",
      },
   },
   website: {
      notEmpty: {
         errorMessage: "website cannot be empty",
      },
      isString: {
         errorMessage: "website must be a string",
      },
   },
};
const updateStudioValidation = {
   name: {
      notEmpty: {
         errorMessage: "login cannot be empty",
      },
      isString: {
         errorMessage: "login must be a string",
      },
   },
   website: {
      notEmpty: {
         errorMessage: "website cannot be empty",
      },
      isString: {
         errorMessage: "website must be a string",
      },
   },
};

module.exports = {
   createStudioValidation,
   updateStudioValidation,
};
