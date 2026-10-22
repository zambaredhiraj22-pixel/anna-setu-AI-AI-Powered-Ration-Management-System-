
const API_URL = 'http://localhost:8080/api/beneficiaries';

function getJwtToken() {
  // Check common token keys used by frontend login implementations.
  const possibleKeys = [
    'token',
    'jwtToken',
    'authToken',
    'accessToken',
    'ration-token',
  ];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);

    if (value && value !== 'null' && value !== 'undefined') {
      try {
        const parsed = JSON.parse(value);

        if (typeof parsed === 'string') return parsed;
        if (parsed?.token) return parsed.token;
        if (parsed?.accessToken) return parsed.accessToken;
      } catch {
        return value;
      }
    }
  }

  // Also support an auth object saved by some login implementations.
  for (const key of ['auth', 'user', 'authData']) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || 'null');
      if (parsed?.token) return parsed.token;
      if (parsed?.accessToken) return parsed.accessToken;
    } catch {
      // Ignore invalid or missing stored values.
    }
  }

  return null;
}

async function request(path = '', options = {}) {
  const token = getJwtToken();

  if (!token) {
    throw new Error(
      'JWT token not found. Please log in first and save the login token in localStorage.'
    );
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
    throw new Error(
      responseText ||
        `Request failed with status ${response.status}`
    );
  }

  if (!responseText) return null;

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

const beneficiaryService = {
  getAll() {
    return request();
  },

  getById(id) {
    return request(`/${id}`);
  },

  create(beneficiary) {
    return request('', {
      method: 'POST',
      body: JSON.stringify(beneficiary),
    });
  },

  update(id, beneficiary) {
    return request(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(beneficiary),
    });
  },

  delete(id) {
    return request(`/${id}`, {
      method: 'DELETE',
    });
  },
};

export default beneficiaryService;
