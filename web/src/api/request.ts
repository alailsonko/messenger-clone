export const request = async <T>(
  url: string,
  method: string = 'GET',
  body?: any
): Promise<T> => {
  let baseUrl = process.env.REACT_APP_BACKEND_URL!;
  if (!baseUrl.endsWith('/')) {
    baseUrl += '/';
  }

  const response = await fetch(`${baseUrl}${url}`, {
    credentials: 'include',
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
