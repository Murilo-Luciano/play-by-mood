import { queue } from "@/workers/test.worker";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("[bullqueueMQ] Handling test bullqueueMQ");

  console.log("SAVING JOB");
  await queue.add("myJob", { testando: "SIM" });

  console.log("[bullqueueMQ] Finished handling test bullqueueMQ");
  return NextResponse.json({ testando: "SIM" });
}
