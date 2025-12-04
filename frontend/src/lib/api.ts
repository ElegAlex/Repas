const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Une erreur est survenue');
  }

  return data;
}

// Types de réponse API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Array<{ field: string; message: string }>;
}
