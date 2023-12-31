import { client } from "../index.js";
export async function addUser(data) {
  return await client.db("jobseekerapp").collection("users").insertOne(data);
}
export async function getUserByUsername(email) {
  return await client
    .db("jobseekerapp")
    .collection("users")
    .findOne({ email: email });
}
export async function getUsers() {
  return await client.db("jobseekerapp").collection("users").find({}).toArray();
}
export async function updateUser({ email, randomnum }) {
  return await client
    .db("jobseekerapp")
    .collection("users")
    .updateOne({ email: email }, { $set: { rnm: randomnum } });
}
export async function updateUserByemail({ email, password }) {
  return await client
    .db("jobseekerapp")
    .collection("users")
    .updateOne({ email: email }, { $set: { password: password } });
}
export async function addprofile(email, data) {
  return await client
    .db("jobseekerapp")
    .collection("users")
    .updateOne({ email: email }, { $set: { ...data, profile: true } });
}
export async function updateprofile(
  email,

  Name,
  DOB,
  Contact_Number,
  Whatsapp_Number,
  Educational_Qualification,
  Experience,
  Resume
) {
  return await client
    .db("jobseekerapp")
    .collection("users")
    .updateOne(
      { email: email },
      {
        $set: {
          Name: Name,
          DOB: DOB,
          Contact_Number: Contact_Number,
          Whatsapp_Number: Whatsapp_Number,
          Educational_Qualification: Educational_Qualification,
          Experience: Experience,
          Resume: Resume,
        },
      }
    );
}
