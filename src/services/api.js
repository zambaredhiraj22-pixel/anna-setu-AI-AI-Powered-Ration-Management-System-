
const API_BASE = "http://localhost:8080/api";

export async function apiRequest(path, options = {}, token) {
  const savedToken =
    token ||
    localStorage.getItem("ration-token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwtToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");

  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  if (savedToken) {
    headers.Authorization = `Bearer ${savedToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const error = await response.json();
      message =
        error.message ||
        error.detail ||
        error.error ||
        message;
    } catch {
      // The server may return an empty or non-JSON error response.
    }

    if (response.status === 401) {
      throw new Error("Session expired or invalid token. Please log in again.");
    }

    if (response.status === 403) {
      throw new Error(
        "Access denied. Please check your account role and permissions."
      );
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export default API_BASE;
