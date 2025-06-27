import MuxPlayer from "@mux/mux-player-react/lazy";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@transcripthor/backend/convex/_generated/api";
import type { Id } from "@transcripthor/backend/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";
import {
  AlertCircle,
  Eye,
  EyeOff,
  GripVertical,
  Move,
  Play,
} from "lucide-react";
import { Responsive, WidthProvider } from "react-grid-layout";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const ResponsiveGridLayout = WidthProvider(Responsive);

const convexClient = new ConvexHttpClient(
  import.meta.env.VITE_CONVEX_URL as string,
);

// Drag Handle Component
interface DragHandleProps {
  className?: string;
  title?: string;
}

function DragHandle({
  className,
  title = "Drag to move widget",
}: DragHandleProps) {
  return (
    <div
      className={cn(
        "drag-handle flex cursor-move items-center justify-center",
        "rounded-sm transition-colors hover:bg-muted/50",
        "border border-muted-foreground/20 border-dashed",
        "hover:border-muted-foreground/40",
        className,
      )}
      title={title}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

// Widget Components
interface VideoWidgetProps {
  playbackId: string;
  title?: string;
}

function VideoWidget({
  playbackId,
  title = "Interview Recording",
}: VideoWidgetProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Play className="h-4 w-4" />
            {title}
          </CardTitle>
          {/* Drag Handle */}
          <DragHandle className="px-2 py-1 " />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-4">
        <div className="aspect-video h-full w-full overflow-hidden rounded-lg border">
          <MuxPlayer
            loading="viewport"
            playbackId={playbackId}
            metadata={{
              video_id: "video-id-123456",
              video_title: "Interview Recording",
              viewer_user_id: "user-id-bc-789",
            }}
            className="h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface AttentionData {
  Attentive: number;
  Distracted: number;
}

interface PredictionWidgetProps {
  data: AttentionData;
}

function PredictionWidget({ data }: PredictionWidgetProps) {
  const chartData = [
    { name: "Attentive", value: data.Attentive, color: "#10b981" },
    { name: "Distracted", value: data.Distracted, color: "#ef4444" },
  ];

  const total = data.Attentive + data.Distracted;
  const attentivePercentage = (data.Attentive / total) * 100;
  const distractedPercentage = (data.Distracted / total) * 100;

  const getAttentionStatus = (percentage: number) => {
    if (percentage >= 80)
      return { label: "Excellent", variant: "default" as const };
    if (percentage >= 60)
      return { label: "Good", variant: "secondary" as const };
    if (percentage >= 40) return { label: "Fair", variant: "outline" as const };
    return { label: "Poor", variant: "destructive" as const };
  };

  const attentionStatus = getAttentionStatus(attentivePercentage);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-4 w-4" />
              Attention Analysis
            </CardTitle>
            <Badge variant={attentionStatus.variant}>
              {attentionStatus.label}
            </Badge>
          </div>
          {/* Drag Handle */}
          <DragHandle className="px-2 py-1" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {/* Pie Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.value}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${((value / total) * 100).toFixed(1)}%`,
                  "Percentage",
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <Separator />

        {/* Progress Bars */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-600" />
                <span className="font-medium text-sm">Attentive</span>
              </div>
              <span className="font-medium text-green-600 text-sm">
                {attentivePercentage.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={attentivePercentage}
              className="h-2"
              style={
                {
                  "--progress-background": "#10b981",
                } as React.CSSProperties
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-red-600" />
                <span className="font-medium text-sm">Distracted</span>
              </div>
              <span className="font-medium text-red-600 text-sm">
                {distractedPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={distractedPercentage}
              className="h-2"
              style={
                {
                  "--progress-background": "#ef4444",
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        {/* Summary Stats */}
        <Separator />
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="font-bold text-2xl text-green-600">
              {data.Attentive.toFixed(0)}
            </div>
            <div className="text-muted-foreground text-xs">Attentive Score</div>
          </div>
          <div className="space-y-1">
            <div className="font-bold text-2xl text-red-600">
              {data.Distracted.toFixed(0)}
            </div>
            <div className="text-muted-foreground text-xs">
              Distracted Score
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton components
function VideoWidgetSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-8" />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="aspect-video h-full w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function PredictionWidgetSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-6 w-8" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Separator />
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const Route = createFileRoute("/interviews/$id")({
  loader: async ({ params }) => {
    const data = await convexClient.action(
      api.actions.interviews.getOneWithContent,
      {
        id: params.id as Id<"interviews">,
      },
    );
    return data;
  },
  component: RouteComponent,
  pendingComponent: () => (
    <div className="size-full p-4">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VideoWidgetSkeleton />
        </div>
        <div>
          <PredictionWidgetSkeleton />
        </div>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex size-full items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error Loading Interview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </CardContent>
      </Card>
    </div>
  ),
});

function RouteComponent() {
  const data = Route.useLoaderData();

  if (!data?.interview) {
    return (
      <div className="flex size-full items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-lg">
                Interview not found
              </h3>
              <p className="mt-2 text-muted-foreground text-sm">
                The interview you're looking for doesn't exist or has been
                removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const prediction = data.prediction[0].results.predictions[0] as unknown as {
    custom_models: {
      "ce111849-8230-4d6c-ac6e-5d5f90d78f5a": {
        output: AttentionData;
      };
    };
  };

  const attentionData =
    prediction.custom_models["ce111849-8230-4d6c-ac6e-5d5f90d78f5a"].output;

  // Enhanced Grid layout configuration with snappy behavior
  const layouts = {
    lg: [
      {
        i: "video",
        x: 0,
        y: 0,
        w: 8,
        h: 6,
        minW: 6,
        minH: 4,
        maxW: 12,
        maxH: 8,
      },
      {
        i: "prediction",
        x: 8,
        y: 0,
        w: 4,
        h: 6,
        minW: 3,
        minH: 4,
        maxW: 6,
        maxH: 8,
      },
    ],
    md: [
      {
        i: "video",
        x: 0,
        y: 0,
        w: 6,
        h: 6,
        minW: 4,
        minH: 4,
        maxW: 8,
        maxH: 8,
      },
      {
        i: "prediction",
        x: 6,
        y: 0,
        w: 4,
        h: 6,
        minW: 3,
        minH: 4,
        maxW: 6,
        maxH: 8,
      },
    ],
    sm: [
      {
        i: "video",
        x: 0,
        y: 0,
        w: 6,
        h: 6,
        minW: 4,
        minH: 4,
        maxW: 6,
        maxH: 8,
      },
      {
        i: "prediction",
        x: 0,
        y: 6,
        w: 6,
        h: 4,
        minW: 4,
        minH: 3,
        maxW: 6,
        maxH: 6,
      },
    ],
    xs: [
      {
        i: "video",
        x: 0,
        y: 0,
        w: 4,
        h: 4,
        minW: 4,
        minH: 3,
        maxW: 4,
        maxH: 6,
      },
      {
        i: "prediction",
        x: 0,
        y: 4,
        w: 4,
        h: 4,
        minW: 4,
        minH: 3,
        maxW: 4,
        maxH: 6,
      },
    ],
  };

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480 };
  const cols = { lg: 12, md: 10, sm: 6, xs: 4 };

  return (
    <div className="size-full bg-background p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Interview Dashboard
            </h1>
            <p className="text-muted-foreground">
              Analysis for Interview ID:
              <Badge variant="outline" className="ml-2">
                {data.interview._id}
              </Badge>
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Move className="h-4 w-4" />
            <span>Drag widgets by their handle to rearrange</span>
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Dashboard Grid with Snappy Behavior */}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={60}
        // Grid Snapping Configuration
        compactType="vertical" // Enable vertical compacting
        preventCollision={false} // Allow overlapping to enable snapping
        allowOverlap={false} // Prevent actual overlaps
        // Drag Handle Configuration
        draggableHandle="drag-handle" // Only elements with this class can be dragged
        isDraggable={true}
        isResizable={true}
        // Snappy margins and padding
        containerPadding={[12, 12]}
        margin={[12, 12]}
        // Animation for smooth snapping
        useCSSTransforms={true}
        autoSize={true}
      >
        <div key="video" className="widget">
          <VideoWidget
            playbackId={data.interview.playback_id || ""}
            title="Interview Recording"
          />
        </div>

        <div key="prediction" className="widget">
          <PredictionWidget data={attentionData} />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}
