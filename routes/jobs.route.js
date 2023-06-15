import express from "express";
import { addJobs, getJobs } from "../services/jobs.service.js";
const router = express.Router();

router.get("/", async function (request, response) {
  const jobs = await getJobs();

  response.send(jobs);
});
router.post("/", async function (request, response) {
  const data = request.body;
  const jobs = await addJobs(data);

  response.send("successfully added..");
});

export default router;
