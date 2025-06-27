import * as UpChunk from "@mux/upchunk";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "@transcripthor/backend/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { Clock, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  component: Page,
});
function Page() {
  const [open, setOpen] = useState(false);
  const getURL = useAction(api.actions.mux.getAuthenticatedUrl);
  const createInterview = useMutation(api.interviews.create);
  const interviews = useQuery(api.interviews.getAll);

  const handleUpload = async (input: React.ChangeEvent<HTMLInputElement>) => {
    const file = input.target.files?.[0];
    console.log("here", file);
    if (!file) return;

    setOpen(false);

    const toastId = toast.loading("Uploading... 0%");
    const { url, id } = await getURL();

    const upload = UpChunk.createUpload({
      endpoint: url,
      file,
      chunkSize: 5120, // Uploads the file in ~5mb chunks
    });

    upload.on("progress", (event) => {
      const pct = Math.round(event.detail);
      toast.loading(`Uploading... ${pct}%`, { id: toastId });
    });

    upload.on("error", (err) => {
      toast.error(err.detail, { id: toastId });
    });

    upload.on("success", () => {
      createInterview({ upload_id: id });
      toast.success("Video uploaded!", { id: toastId });
    });
  };

  if (!interviews) return null;

  return (
    <div className="h-full w-full p-8">
      <div className="mb-2 flex w-full items-center justify-between">
        <h1 className="font-semibold text-2xl">Interviews</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload />
              Upload Interview
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select and Upload a Interview</DialogTitle>
              <DialogDescription>
                Uploaded interviews will be processed in parallel.
              </DialogDescription>
              <div className="my-2">
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleUpload(e)}
                />
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {interviews.map((interview) => (
          <Link
            to="/interviews/$id"
            params={{ id: interview._id }}
            key={interview._id}
          >
            <div className="relative w-full">
              <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-md bg-slate-700">
                {interview.playback_id ? (
                  <img
                    alt="Interview cape"
                    className="grow"
                    src={`https://image.mux.com/${interview.playback_id}/thumbnail.png?width=1920&height=1080&time=1`}
                  />
                ) : (
                  <Clock />
                )}
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-black/50 px-4 py-2">
                {new Date(interview._creationTime).toLocaleString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Page;
