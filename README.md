# Transcripthor 🎥🧠

**AI-Powered Interview Analysis Platform**

Transcripthor is a modern web application that combines video recording with AI-powered attention analysis to help HR teams and recruiters evaluate candidate engagement during interviews. Upload interview videos and get detailed attention metrics with beautiful, interactive dashboards.

## 🚀 What It Does

- **📹 Video Upload & Processing**: Seamless video upload using Mux with chunked uploads and real-time progress
- **🤖 AI Attention Analysis**: Powered by Hume AI to analyze attention levels (attentive vs distracted) throughout interviews
- **📊 Interactive Dashboards**: Drag-and-drop widgets with pie charts, progress bars, and attention scores
- **⚡ Real-time Updates**: Live data synchronization using Convex backend
- **📱 Responsive Design**: Works beautifully on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 19, TanStack Router, TailwindCSS, shadcn/ui
- **Backend**: Convex (real-time database & serverless functions)
- **Video**: Mux (upload, processing, streaming)
- **AI**: Hume AI (attention analysis)
- **Build**: Turborepo monorepo, Vite, pnpm workspaces
- **Code Quality**: Biome (linting/formatting), TypeScript, Husky

## 🏗️ Project Structure

```
transcripthor/
├── apps/
│   └── web/                    # React frontend application
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── routes/         # File-based routing
│       │   │   ├── index.tsx   # Interview list & upload
│       │   │   └── interviews/
│       │   │       └── $id.tsx # Interview dashboard
│       │   └── lib/           # Utilities
├── packages/
│   └── backend/               # Convex backend
│       └── convex/
│           ├── actions/       # Server actions (Mux, Hume AI)
│           ├── interviews.ts  # Database queries/mutations
│           └── schema.ts      # Database schema
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Convex account
- Mux account (for video processing)
- Hume AI account (for attention analysis)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repo-url>
cd transcripthor
pnpm install
```

2. **Set up Convex backend:**
```bash
pnpm dev:setup
```
Follow the prompts to create a new Convex project.

3. **Configure environment variables:**
Create `.env.local` in the backend package with:
```bash
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret
HUME_API_KEY=your_hume_api_key
```

4. **Start development servers:**
```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) to see the application.

## 📖 How It Works

1. **Upload Interview**: Users upload video files through the web interface
2. **Video Processing**: Mux processes the video and generates playback URLs
3. **AI Analysis**: Hume AI analyzes the video for attention patterns
4. **Dashboard**: Interactive dashboard displays video player alongside attention analytics
5. **Insights**: Visual charts show attention distribution, scores, and engagement metrics

## 🎯 Key Features

- **Chunked Video Upload**: Large files uploaded in 5MB chunks with progress tracking
- **Real-time Processing**: Live updates as videos are processed and analyzed
- **Drag & Drop Dashboard**: Customizable widget layout with responsive grid
- **Attention Metrics**: Detailed breakdown of attentive vs distracted moments
- **Visual Analytics**: Pie charts, progress bars, and color-coded attention scores
- **Mobile Responsive**: Optimized layouts for all screen sizes

## 📜 Available Scripts

- `pnpm dev` - Start all services (web + backend)
- `pnpm dev:web` - Start web app only (port 3001)
- `pnpm dev:server` - Start backend/Convex only
- `pnpm build` - Build all packages
- `pnpm check` - Run Biome linter/formatter
- `pnpm check-types` - TypeScript type checking

## 🤝 Contributing

This project uses Biome for code formatting and linting. Run `pnpm check` before committing to ensure code quality.

---

Built with ❤️ using the [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack)
