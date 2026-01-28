export class ApiError extends Error {
  constructor(public status: number, public statusText: string, public data: any) {
    super(`API Error ${status}: ${statusText}`);
  }
}

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    throw new ApiError(res.status, res.statusText, data);
  }
  // Check for 204 No Content
  if (res.status === 204) {
    return null;
  }
  return res.json();
};

export const fetcher = async <T>(url: string): Promise<T> => {
    const res = await fetch(url);
    return handleResponse(res);
};

export const apiClient = {
  get: <T>(url: string) => fetcher<T>(url),
  
  post: <T>(url: string, body: unknown) => 
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(res => handleResponse(res)) as Promise<T>,
    
  put: <T>(url: string, body: unknown) => 
    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(res => handleResponse(res)) as Promise<T>,
    
  delete: <T>(url: string) => 
    fetch(url, { method: 'DELETE' }).then(res => handleResponse(res)) as Promise<T>,
};
