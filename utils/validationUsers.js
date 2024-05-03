const createUserValidation = {
   login: {
      notEmpty: {
         errorMessage: "login cannot be empty",
      },
      isString: {
         errorMessage: "login must be a string",
      },
   },
   password: {
      notEmpty: {
         errorMessage: "password cannot be empty",
      },
      isString: {
         errorMessage: "password must be a string",
      },
   },
};

module.exports = {
   createUserValidation,
};
