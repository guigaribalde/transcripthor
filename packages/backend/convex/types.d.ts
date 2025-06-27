// Hume AI Inference Job Types

export type BurstModel = Record<string, never>;

export interface FaceModel {
  descriptions: boolean | null;
  facs: boolean | null;
  fps_pred: number;
  identify_faces: boolean;
  min_face_size: number;
  prob_threshold: number;
  save_faces: boolean;
}

export type FacemeshModel = Record<string, never>;

export interface LanguageModel {
  granularity: "word" | "utterance" | "sentence";
  identify_speakers: boolean;
  sentiment: boolean | null;
  toxicity: boolean | null;
}

export interface NerModel {
  identify_speakers: boolean;
}

export interface ProsodyModel {
  granularity: "word" | "utterance" | "sentence";
  identify_speakers: boolean;
  window: number | null;
}

export interface Models {
  burst: BurstModel;
  face: FaceModel;
  facemesh: FacemeshModel;
  language: LanguageModel;
  ner: NerModel;
  prosody: ProsodyModel;
}

export interface InferenceRequest {
  callback_url: string | null;
  files: string[];
  models: Models;
  notify: boolean;
  text: string[];
  urls: string[];
}

export interface InferenceState {
  created_timestamp_ms: number;
  ended_timestamp_ms: number;
  num_errors: number;
  num_predictions: number;
  started_timestamp_ms: number;
  status: "QUEUED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
}

export interface InferenceJob {
  type: "INFERENCE";
  job_id: string;
  request: InferenceRequest;
  state: InferenceState;
}

/* new endpoint */
export interface ApiResponseItem {
  source: Source;
  results: Results;
}

export interface Source {
  type: string;
  url: string;
}

export interface Results {
  predictions: Prediction[];
  errors: unknown[];
}

export interface Prediction {
  file: string;
  models: Record<string, ModelResult>;
}

export interface ModelResult {
  metadata: unknown | null;
  grouped_predictions: GroupedPrediction[];
}

export interface GroupedPrediction {
  id: string;
  predictions: PredictionDetail[];
}

export interface PredictionDetail {
  frame: number;
  time: number;
  prob: number;
  box: Box;
  emotions: Emotion[];
  facs: unknown | null;
  descriptions: unknown | null;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Emotion {
  name: string;
  score: number;
}

/** The top-level response is an array of these items */
export type ApiResponse = ApiResponseItem[];
