import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  interviews: defineTable({
    upload_id: v.string(),
    asset_id: v.optional(v.string()),
    playback_id: v.optional(v.string()),
    job_id: v.optional(v.string()),
  }),
});
