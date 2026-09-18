import {
  ApiHealthResponse,
  FastApiValidationError,
  SbaPredictionRequest,
  SbaPredictionResponse,
} from '../types/sba';

const DEFAULT_BASE_URL = 'https://sba-e8d3.onrender.com';

export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return DEFAULT_BASE_URL;
}

export class ApiError extends Error {
  statusCode?: number;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    statusCode?: number,
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Sends a prediction request to POST /predict
 */
export async function predictRisk(
  payload: SbaPredictionRequest,
  onProgress?: (secondsElapsed: number) => void,
): Promise<SbaPredictionResponse> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/predict`;

  // Prepare exact payload according to specification
  const sanitizedPayload: SbaPredictionRequest = {
    gross_approval: Number(payload.gross_approval),
    term_months: Math.round(Number(payload.term_months)),
    interest_rate: Number(payload.interest_rate),
    processing_method: payload.processing_method,
    business_type: payload.business_type,
    business_age: payload.business_age,
    collateral: payload.collateral === 'Y' ? 'Y' : 'N',
    revolver: payload.revolver === 'Y' ? 'Y' : 'N',
    rate_type: payload.rate_type === 'F' ? 'F' : 'V',
    naics_code: String(payload.naics_code),
    borr_state: payload.borr_state,
    jobs_supported: Number(payload.jobs_supported),
    is_franchise: Boolean(payload.is_franchise),
    lender_type: payload.lender_type,
    bank_name:
      payload.bank_name && payload.bank_name.trim().length > 0
        ? payload.bank_name.trim()
        : '',
    bank_state:
      payload.bank_state && payload.bank_state.trim().length > 0
        ? payload.bank_state.trim()
        : '',
  };

  const controller = new AbortController();
  // 95-second timeout to accommodate Render free-tier cold starts
  const timeoutId = setTimeout(() => controller.abort(), 95000);

  // Interval to notify caller about elapsed time
  let elapsed = 0;
  const intervalId = setInterval(() => {
    elapsed += 1;
    onProgress?.(elapsed);
  }, 1000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitizedPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    clearInterval(intervalId);

    if (!response.ok) {
      if (response.status === 422) {
        let fieldErrors: Record<string, string> = {};
        let generalMessage = 'The server rejected some form values.';
        try {
          const errJson = (await response.json()) as FastApiValidationError;
          if (Array.isArray(errJson.detail)) {
            const messages = errJson.detail.map((item) => {
              const fieldName =
                item.loc && item.loc.length > 1
                  ? String(item.loc[item.loc.length - 1])
                  : 'field';
              fieldErrors[fieldName] = item.msg;
              return `${fieldName}: ${item.msg}`;
            });
            generalMessage = `Validation error: ${messages.join('; ')}`;
          }
        } catch {
          // fallback to generic message if not valid JSON
        }
        throw new ApiError(generalMessage, 422, fieldErrors);
      }

      if (response.status >= 500) {
        throw new ApiError(
          `Prediction service error (${response.status}). The server may be reloading or encountering an internal error. Please try again shortly.`,
          response.status,
        );
      }

      throw new ApiError(
        `Unexpected response from server (${response.status}: ${response.statusText})`,
        response.status,
      );
    }

    const data = (await response.json()) as SbaPredictionResponse;
    return data;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    clearInterval(intervalId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(
        'Request timed out after 95 seconds. The prediction server may be taking longer than usual to wake up from sleep. Please try again.',
        408,
      );
    }

    throw new ApiError(
      'Unable to connect to the prediction service. The server may be asleep or unreachable. Please check your connection and try again.',
      0,
    );
  }
}

/**
 * Checks model and service health via GET /health
 */
export async function checkModelHealth(): Promise<ApiHealthResponse> {
  const baseUrl = getApiBaseUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return (await res.json()) as ApiHealthResponse;
    }
    return { status: 'unhealthy', model_loaded: false };
  } catch {
    clearTimeout(timeoutId);
    return { status: 'unreachable', model_loaded: false };
  }
}
