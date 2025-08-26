/**
 * HTTP utilities with timeout support for external API calls
 */

export interface HttpGetOptions {
  timeout?: number;
  signal?: AbortSignal;
}

export async function httpGet(
  url: string,
  options: HttpGetOptions = {}
): Promise<Response> {
  const { timeout = 10000 } = options; // Default 10 second timeout

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Combine with any existing signal
  const signal = options.signal
    ? AbortSignal.any([controller.signal, options.signal])
    : controller.signal;

  try {
    const response = await fetch(url, { signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}
