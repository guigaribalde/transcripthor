import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { ApiResponse, InferenceJob } from "./types";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("interviews").collect();
  },
});

export const getOne = query({
  args: {
    id: v.id("interviews"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    upload_id: v.string(),
  },
  handler: async (ctx, args) => {
    const newInterviewId = await ctx.db.insert("interviews", {
      upload_id: args.upload_id,
    });
    return await ctx.db.get(newInterviewId);
  },
});

export const deleteInterview = mutation({
  args: {
    id: v.id("interviews"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const updateByUploadId = mutation({
  args: {
    upload_id: v.string(),
    asset_id: v.optional(v.string()),
    playback_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Prepare update data with only the provided optional fields
    const updateData: { asset_id?: string; playback_id?: string } = {};

    if (args.asset_id !== undefined) {
      updateData.asset_id = args.asset_id;
    }

    if (args.playback_id !== undefined) {
      updateData.playback_id = args.playback_id;
    }

    // Find the interview by upload_id
    const interview = await ctx.db
      .query("interviews")
      .filter((q) => q.eq(q.field("upload_id"), args.upload_id))
      .first();

    const videoUrl = `https://stream.mux.com/${updateData.playback_id}/highest.mp4`;
    const response = await fetch(
      "https://api.hume.ai/v0/batch/jobs/tl/inference",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Hume-Api-Key": process.env.HUME_API_KEY as string,
        },
        body: JSON.stringify({
          custom_model: {
            id: "0b4a1c48-dd75-48c4-9972-e72a592e8ce7",
          },
          urls: [videoUrl],
        }),
      },
    );
    if (!response.ok) {
      throw new ConvexError(`HTTP error! status: ${response.status}`);
    }
    const data: { job_id: string } = await response.json();

    if (!interview) {
      const newInterviewId = await ctx.db.insert("interviews", {
        upload_id: args.upload_id,
        ...updateData,
        job_id: data.job_id,
      });

      return await ctx.db.get(newInterviewId);
    }

    await ctx.db.patch(interview._id, {
      ...updateData,
      job_id: data.job_id,
    });

    return await ctx.db.get(interview._id);
  },
});
