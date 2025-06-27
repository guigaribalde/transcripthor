"use node";

import Mux from "@mux/mux-node";
import { action } from "../_generated/server";

export const getAuthenticatedUrl = action({
  args: {},
  handler: async () => {
    console.log(process.env.MUX_TOKEN_ID);
    const mux = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
    });

    const upload = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["public"],
        video_quality: "basic",
        // const videoUrl = `https://stream.mux.com/${videoAsset.playback_ids[0].id}/highest.mp4`;
        static_renditions: [
          {
            resolution: "highest",
          },
        ],
      },
    });

    return upload;
  },
});
