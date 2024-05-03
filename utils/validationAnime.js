const createAnimeValidation = {
   name: {
      notEmpty: {
         errorMessage: "name cannot be empty",
      },
      isString: {
         errorMessage: "name must be a string",
      },
   },
   year: {
      notEmpty: {
         errorMessage: "year cannot be empty",
      },
      isInt: {
         errorMessage: "year must be a integer",
      },
   },
   studioid: {
      isString: {
         errorMessage: "studioId must be a string",
      },
   },
};
const updateAnimeValidation = {
   name: {
      notEmpty: {
         errorMessage: "name cannot be empty",
      },
      isString: {
         errorMessage: "name must be a string",
      },
   },
   year: {
      notEmpty: {
         errorMessage: "year cannot be empty",
      },
      isInt: {
         errorMessage: "year must be a integer",
      },
   },
   studioid: {
      isString: {
         errorMessage: "studioId must be a string",
      },
   },
};

module.exports = {
   createAnimeValidation,
   updateAnimeValidation,
};
