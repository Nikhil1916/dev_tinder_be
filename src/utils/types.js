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

module.exports = {
  signUpSchema,
  loginSchema,
};
