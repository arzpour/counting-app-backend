import Joi from "joi";

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)/;

export const userLoginValidationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const userRegistrationValidationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required().min(8).pattern(passwordRegex),
});

