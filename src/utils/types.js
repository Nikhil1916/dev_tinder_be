const { z } = require("zod");
const signUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  emailId: z.string(),
  password: z.string(),
});

const loginSchema = z.object({
  emailId: z.string(),
  password: z.string(),
});

const editProfileSchema = z.object({
  firstName: z.string()?.optional(),
  lastName: z.string()?.optional(),
  emailId: z.string()?.optional(),
  age: z.number()?.optional(),
  gender: z.string()?.optional(),
  photoUrl: z.string()?.optional(),
  skills: z.array()?.optional(),
});

module.exports = {
  signUpSchema,
  loginSchema,
  editProfileSchema,
};
