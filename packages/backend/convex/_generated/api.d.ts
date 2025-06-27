/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions_interviews from "../actions/interviews.js";
import type * as actions_mux from "../actions/mux.js";
import type * as healthCheck from "../healthCheck.js";
import type * as http from "../http.js";
import type * as interviews from "../interviews.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/interviews": typeof actions_interviews;
  "actions/mux": typeof actions_mux;
  healthCheck: typeof healthCheck;
  http: typeof http;
  interviews: typeof interviews;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
