const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Please enter your name properly");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("first name should be between 4-50 letter");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please provide the correct email id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password!");
  }
};

module.exports = {
  validateSignUpData,
};
