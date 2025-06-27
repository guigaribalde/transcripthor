"use node";

import { v } from "convex/values";
import { api } from "../_generated/api";
import type { Doc } from "../_generated/dataModel";
import { action } from "../_generated/server";
import type { ApiResponse, InferenceJob } from "../types";

export const getOneWithContent = action({
  args: {
    id: v.id("interviews"),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    interview: Doc<"interviews"> | null;
    details: InferenceJob;
    prediction: ApiResponse;
  }> => {
    const interview: Doc<"interviews"> | null = await ctx.runQuery(
      api.interviews.getOne,
      {
        id: args.id,
      },
    );

    const [detailsResponse, predictionsResponse] = await Promise.all([
      fetch(`https://api.hume.ai/v0/batch/jobs/${interview?.job_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Hume-Api-Key": process.env.HUME_API_KEY as string,
        },
      }),
      fetch(
        `https://api.hume.ai/v0/batch/jobs/${interview?.job_id}/predictions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Hume-Api-Key": process.env.HUME_API_KEY as string,
          },
        },
      ),
    ]);
    const [details, prediction]: [InferenceJob, ApiResponse] =
      await Promise.all([detailsResponse.json(), predictionsResponse.json()]);
    return {
      interview,
      details,
      prediction,
    };
  },
});
