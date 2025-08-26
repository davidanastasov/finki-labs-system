import ky from "ky";
import { env } from "@/env";

const apiClient = ky.create({
  prefixUrl: env.VITE_API_BASE_URL,
  retry: 0,
  headers: {
    Accept: "application/json",
  },
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          return response;
        }

        try {
          const cloned = response.clone();
          const body = (await cloned.json()) as GenericResponse<unknown>;

          if (body.success === false) {
            throw new APIError(body.message, body.statusCode);
          }

          return response;
        } catch (error) {
          if (error instanceof APIError) {
            throw error;
          }

          // If JSON parsing failed, return the original response
          return response;
        }
      },
    ],
  },
});

export default apiClient;

export class APIError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
  }
}

// === Types ===

interface SuccessResponse<T = any> {
  success: true;
  data: T;
}

interface FailedResponse {
  success: false;
  message: string;
  statusCode: number;
}

type GenericResponse<T> = SuccessResponse<T> | FailedResponse;

export type PaginatedResponse<T> = { count: number; result: T };
