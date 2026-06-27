import api from './api';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isColdStartError = (error) => {
  // Connection refused, timeout, network errors = cold start
  if (!error.response) return true; // Network error
  if (error.response?.status >= 500) return true; // Server error
  return false;
};

export const withColdStartRetry = async (callback, { onShowOverlay, onHideOverlay } = {}) => {
  try {
    // Try the request first without waiting
    return await callback();
  } catch (error) {
    // If it's not a cold-start error, throw immediately
    if (!isColdStartError(error)) {
      throw error;
    }

    // Backend is down, show overlay and retry
    if (onShowOverlay) onShowOverlay();

    try {
      // Wait for backend to come up
      await waitForBackend();
      // Retry the original callback
      return await callback();
    } finally {
      if (onHideOverlay) onHideOverlay();
    }
  }
};

export const waitForBackend = async ({ timeoutMs = 30000, onAttempt } = {}) => {
  const startTime = Date.now();
  let attempt = 0;
  let delay = 2000;

  while (Date.now() - startTime < timeoutMs) {
    attempt += 1;
    try {
      if (onAttempt) onAttempt(attempt);
      await api.get('/health', { timeout: 5000 });
      return;
    } catch (error) {
      const elapsed = Date.now() - startTime;
      if (elapsed >= timeoutMs) break;
      await sleep(delay);
      delay = Math.min(Math.round(delay * 1.5), 8000);
    }
  }

  throw new Error('Backend not responding');
};
