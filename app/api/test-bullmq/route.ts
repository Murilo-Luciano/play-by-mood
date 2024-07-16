import connectDB from "@/config/db";
import TestModel from "@/models/TesteBull";
import { FlowProducer, Queue, QueueEvents, Worker } from "bullmq";
import { NextRequest, NextResponse } from "next/server";

const connection = {
  host: process.env.REDIS_HOST_URL,
  port: 12972,
  password: process.env.REDIS_PASSWORD,
};

const queue = new Queue("Teste", {
  connection,
});

const worker = new Worker(
  "Teste",
  async (job) => {
    console.log(`HANDLING job ${job.data.testando}`);

    await connectDB();

    await TestModel.create({ testando: "SIM" });
    console.log("AQUI!!! ----> ", await TestModel.countDocuments());

    console.log(`FINISH HANDLING job ${job.data.testando}`);

    return "HELLO WORLD";
  },
  {
    connection,
  }
);

const queueEvents = new QueueEvents("Teste", { connection });

queueEvents.on("waiting", ({ jobId }) => {
  console.log(`A job with ID ${jobId} is waiting`);
});

queueEvents.on("active", ({ jobId, prev }) => {
  console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});

queueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(`${jobId} has completed and returned ${returnvalue}`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`${jobId} has failed with reason ${failedReason}`);
});

const flowProducer = new FlowProducer({ connection });

export async function GET(request: NextRequest) {
  console.log("[bullqueueMQ] Handling test bullqueueMQ");

  console.log("SAVING JOB");
  await queue.add("myJob", { testando: "SIM" });

  console.log("[bullqueueMQ] Finished handling test bullqueueMQ");
  return NextResponse.json({ testando: "SIM" });
}
