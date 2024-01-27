const joiErrorFormatter = (RawErrors) => {
  const errors = {};
  const Details = RawErrors.details;

  Details.map((detail) => {
    errors[detail.path] = [detail.message];
  });
  return errors;
};

const validateInput = (schema, data) => {
  const validInput = schema(data, { abortEarly: false });
  if (validInput.error) {
    return joiErrorFormatter(validInput.error);
  }
  return validInput;
};

module.exports = {
  validateInput,
};
