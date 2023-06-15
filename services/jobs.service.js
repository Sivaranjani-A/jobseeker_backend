import { client } from "../index.js";
export async function getJobs() {
  return await client.db("jobseekerapp").collection("jobs").find({}).toArray();
}
export async function addJobs(data) {
  return await client.db("jobseekerapp").collection("jobs").insertMany(data);
}
