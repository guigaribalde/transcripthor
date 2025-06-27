import type { UnwrapWebhookEvent } from "@mux/mux-node/resources/webhooks.mjs";
import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/mux",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Step 1: Get the raw body for signature verification
      const rawBody = await request.text();

      // Step 2: Get the Mux signature from headers
      const muxSignature = request.headers.get("mux-signature");

      if (!muxSignature) {
        console.error("Missing Mux signature header");
        return new Response("Missing signature", { status: 401 });
      }

      // Step 3: Verify the webhook signature (optional but recommended)
      const isValidSignature = await verifyMuxSignature(
        rawBody,
        muxSignature,
        process.env.MUX_WEBHOOK_SECRET as string, // Add this to your environment variables
      );

      if (!isValidSignature) {
        console.error("Invalid webhook signature");
        return new Response("Invalid signature", { status: 401 });
      }

      // Step 4: Parse the webhook payload with type safety
      const webhookEvent: UnwrapWebhookEvent = JSON.parse(rawBody);
      console.log("Mux webhook event:", webhookEvent);

      // Step 5: Handle different event types with proper typing
      switch (webhookEvent.type) {
        case "video.asset.created":
          console.log("video.asset.created");
          break;

        case "video.asset.ready":
          //@ts-ignore because we dont know this is now working
          await ctx.runMutation(internal.interviews.updateByUploadId, {
            upload_id: webhookEvent.data.upload_id,
            asset_id: webhookEvent.data.id,
            //@ts-ignore because this will always be true
            playback_id: webhookEvent.data.playback_ids[0].id,
          });
          break;

        case "video.upload.asset_created":
          console.log("video.upload.asset_created");
          break;

        case "video.asset.errored":
          console.log("video.asset.errored");
          break;

        case "video.asset.deleted":
          console.log("video.asset.deleted");
          break;

        case "video.upload.created":
          console.log("video.upload.created");
          break;

        case "video.upload.cancelled":
          console.log("video.upload.cancelled");
          break;

        case "video.upload.errored":
          console.log("video.upload.errored");
          break;

        default:
          console.log(`Unhandled webhook event type: ${webhookEvent.type}`);
      }

      // Step 6: Return success response
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error processing Mux webhook:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }),
});

// Helper function to verify Mux webhook signature
async function verifyMuxSignature(
  body: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  try {
    // Parse the signature header: t=timestamp,v1=signature
    const parts = signature.split(",");
    let timestamp = "";
    let sig = "";

    for (const part of parts) {
      const [key, value] = part.split("=");
      if (key === "t") timestamp = value;
      if (key === "v1") sig = value;
    }

    if (!timestamp || !sig) {
      return false;
    }

    // Create the signed payload: timestamp.body
    const signedPayload = `${timestamp}.${body}`;

    // Create HMAC SHA256 signature
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(signedPayload);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );

    const signature_buffer = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      messageData,
    );
    const expectedSignature = Array.from(new Uint8Array(signature_buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Compare signatures
    return expectedSignature === sig;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

export default http;
