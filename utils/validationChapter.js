const createChapterValidation = {
   name: {
      notEmpty: {
         errorMessage: "name cannot be empty",
      },
      isString: {
         errorMessage: "name must be a string",
      },
   },
   studioid: {
      isString: {
         errorMessage: "studioId must be a string",
      },
   },
   animeid: {
      isString: {
         errorMessage: "animeId must be a string",
      },
   },
   duration: {
      notEmpty: {
         errorMessage: "duration cannot be empty",
      },
      isInt: {
         errorMessage: "duration must be a integer",
      },
   },
};

const updateChapterValidation = {
   name: {
      notEmpty: {
         errorMessage: "name cannot be empty",
      },
      isString: {
         errorMessage: "name must be a string",
      },
   },
   studioid: {
      isString: {
         errorMessage: "studioId must be a string",
      },
   },
   animeid: {
      isString: {
         errorMessage: "animeId must be a string",
      },
   },
   duration: {
      notEmpty: {
         errorMessage: "duration cannot be empty",
      },
      isInt: {
         errorMessage: "duration must be a integer",
      },
   },
};

module.exports = {
   createChapterValidation,
   updateChapterValidation,
};
