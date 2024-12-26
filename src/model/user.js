const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "my_secret";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: "string",
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: "string",
    },
    emailId: {
      type: "string",
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: "string",
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    age: {
      type: "number",
      min: 18,
    },
    gender: {
      type: "string",
      lowercase: "true",
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is incorrect gender type`
      }
    },
    photoUrl: {
      type: "string",
      default:
        "https://www.google.com/imgres?q=user%20photo%20icon&imgurl=https%3A%2F%2Fstatic-00.iconduck.com%2Fassets.00%2Fuser-icon-512x512-r62xmy4p.png&imgrefurl=https%3A%2F%2Ficonduck.com%2Ficons%2F269020%2Fuser&docid=Gzn_ZO1t8sX69M&tbnid=pJar7v7Opj1WiM&vet=12ahUKEwjtu92o6tSJAxXYwzgGHd1HD0QQM3oECGIQAA..i&w=512&h=512&hcb=2&ved=2ahUKEwjtu92o6tSJAxXYwzgGHd1HD0QQM3oECGIQAA",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (params) {
  try {
    const password = params;
    //this here refer to the document as in route we will do user.validatePassword so this in validatePassword
    // points to that user document
    const isPasswordValid = await bcrypt.compare(password, this.password);
    return isPasswordValid;
  } catch (e) {
    throw Error("Invalid credentials" + e?.message);
  }
};

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
};
