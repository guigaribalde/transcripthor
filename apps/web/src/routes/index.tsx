import { createFileRoute } from "@tanstack/react-router";
import { api } from "@transcripthor/backend/convex/_generated/api";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const healthCheck = useQuery(api.healthCheck.get);

  return <div className="container mx-auto max-w-3xl px-4 py-2">asdf</div>;
}
