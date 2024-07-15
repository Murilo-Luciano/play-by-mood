import { FlowProducer, Queue, Worker } from "bullmq";
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

    console.log(`FINISH HANDLING job ${job.data.testando}`);
    return "HELLO WORLD";
  },
  {
    connection,
  }
);

const flowProducer = new FlowProducer({ connection });

export async function GET(request: NextRequest) {
  console.info("[bee-queue] Handling test bee-queue");

  console.log("SAVING JOB");
  await queue.add("myJob", { testando: "SIM" });

  console.info("[bee-queue] Finished handling test bee-queue");
  return NextResponse.json({});
}
