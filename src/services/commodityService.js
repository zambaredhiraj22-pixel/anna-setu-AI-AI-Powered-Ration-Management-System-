
const API_URL = 'http://localhost:8080/api/commodities';

function getJwtToken() {
  const possibleKeys = [
    'token',
    'jwtToken',
    'authToken',
    'accessToken',
    'ration-token',
  ];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);

    if (!value || value === 'null' || value === 'undefined') {
      continue;
    }

    try {
      const parsed = JSON.parse(value);

      if (typeof parsed === 'string') return parsed;
      if (parsed?.token) return parsed.token;
      if (parsed?.accessToken) return parsed.accessToken;
    } catch {
      return value;
    }
  }

  for (const key of ['auth', 'user', 'authData']) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || 'null');

      if (parsed?.token) return parsed.token;
      if (parsed?.accessToken) return parsed.accessToken;
    } catch {
      // Ignore invalid stored values.
    }
  }

  return null;
}

async function request(path = '', options = {}) {
  const token = getJwtToken();

  if (!token) {
    throw new Error('JWT token not found. Please log in first.');
  }

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const responseText = await response.text();

  if (!response.ok) {
    let message = responseText;

    try {
      const parsed = JSON.parse(responseText);
      message =
        parsed.message ||
        parsed.error ||
        parsed.detail ||
        responseText;
    } catch {
      // Keep the original response text.
    }

    if (response.status === 401) {
      throw new Error('Session expired. Please log in again.');
    }

    if (response.status === 403) {
      throw new Error('You do not have permission to perform this action.');
    }

    throw new Error(message || `Request failed (${response.status})`);
  }

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

const commodityService = {
  getAll() {
    return request();
  },

  getById(id) {
    return request(`/${id}`);
  },

  create(commodity) {
    return request('', {
      method: 'POST',
      body: JSON.stringify(commodity),
    });
  },

  update(id, commodity) {
    return request(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(commodity),
    });
  },

  delete(id) {
    return request(`/${id}`, {
      method: 'DELETE',
    });
  },
};

export default commodityService;
