import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import rn from "random-number";
import {
  addUser,
  addprofile,
  getUserByUsername,
  getUsers,
  updateUser,
  updateUserByemail,
  updateprofile,
} from "../services/users.service.js";
const router = express.Router();
const options = {
  min: 1000,
  max: 9999,
  integer: true,
};

async function generateHashedPassword(password) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

router.post("/register", async function (request, response) {
  const { Name, email, password } = request.body;
  const userFromDB = await getUserByUsername(email);

  if (userFromDB) {
    response.send({ message: "username already exist try others" });
  } else if (password.length < 8) {
    response
      
      .send({ message: "password min 8 characters required" });
  } else {
    const hashedPassword = await generateHashedPassword(password);

    const result = await addUser({
      Name: Name,
      email: email,
      password: hashedPassword,
      profile: false,
    });

    if (result) {
      response.status(200).json({ message: "Register Successfully" });
    } else {
      response.status(500).json({ message: "Something went wrong" });
    }
  }
});

router.post("/login", async function (request, response) {
  const { email, password } = request.body;

  const userFromDB = await getUserByUsername(email);

  if (!userFromDB) {
    response.status(401).send({ message: "invalid credentials try again" });
  } else {
    const storedDBPassword = userFromDB.password;
    const isPasswordCheck = await bcrypt.compare(password, storedDBPassword);

    if (isPasswordCheck) {
      const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
      response.send({
        message: "Successful Login",
        token: token,
        email: userFromDB.email,
        profile: userFromDB.profile,
      });
    } else {
      response.status(401).send({ message: "invalid credentials try again" });
    }
  }
});
router.post("/sendmail", async function (request, response) {
  try {
    const email = request.body.email;
    const user = await getUserByUsername(email);
    if (user) {
      let randomnum = rn(options);
      console.log("body", request.body.email);
      await updateUser({ email: request.body.email, randomnum: randomnum });
      var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      var mailOptions = {
        from: process.env.EMAIL,
        to: `${request.body.email}`,
        subject: "User verification",
        text: `${randomnum}`,
        //html: `<h2>Password : ${req.body.Password}</h2>`
      };

      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          response.json({
            message: "Error",
          });
        } else {
          console.log("Email sent: " + info.response);
          response.json({
            message: "Email sent",
          });
        }
      });
    } else {
      response.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
});
// verify

router.post("/verify", async (request, response) => {
  try {
    const { email, vercode } = request.body;
    const user = await getUserByUsername(email);

    if (user.rnm === vercode) {
      response.status(200).json(user);
    } else {
      response.status(400).json({ message: "Invalid Verification Code" });
    }
  } catch (error) {
    console.log(error);
  }
});
// update password
router.post("/changepassword/:email", async function (request, response) {
  try {
    let { password } = request.body;
    const { email } = request.params;
    const hashedPassword = await generateHashedPassword(password);
    password = hashedPassword;
    const result = await updateUserByemail({ email, password });
    if (result) {
      response.json({ message: "Reset the password successfully" });
    } else {
      response.json({ message: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/profile/:email", async function (request, response) {
  const { email } = request.params;
  const data = request.body;
  console.log(email, data);
  const profile = await addprofile(email, data);

  response.send({ message: "Profile Added" });
});
router.get("/profile/:email", async function (request, response) {
  const { email } = request.params;
  const data = request.body;

  const userFromDB = await getUserByUsername(email);

  response.send(userFromDB);
});
router.put("/profile/:email", async function (request, response) {
  const { email } = request.params;

  const {
    Name,
    DOB,
    Contact_Number,
    Whatsapp_Number,
    Educational_Qualification,
    Experience,
    Resume,
  } = request.body;

  const profile = await updateprofile(
    email,
    Name,
    DOB,
    Contact_Number,
    Whatsapp_Number,
    Educational_Qualification,
    Experience,
    Resume
  );

  response.send({ message: "Profile Updated" });
});
router.get("/getlist", async function (request, response) {
  const users = await getUsers();

  response.send(users);
});
router.get("/:email", async function (request, response) {
  const { email } = request.params;

  const userFromDB = await getUserByUsername(email);

  response.send(userFromDB);
});
export default router;
