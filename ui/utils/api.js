export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const buildErrorMessage = (response, responseBody) => {
  let errorMessage = `Error ${response.status}: ${response.statusText}.`;

  if (responseBody) {
    if (responseBody.error_code) errorMessage += ` Error code: ${responseBody.error_code}.`;
    if (responseBody.errors) errorMessage += responseBody.errors.map((err) => ` ${err}`).join('');
  }

  return errorMessage;
};

const parseResponseBody = async (response) => {
  let parsedBody;
  try {
    parsedBody = await response.clone().json();
  } catch (e) {
    parsedBody = await response.text();
  }

  return parsedBody;
};

export const request = async (endpoint, method = 'GET', body = null, fullResponse = false) => {
  const options = { method, headers: { 'Content-Type': 'application/json' } };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(endpoint, options);
  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const errorMessage = buildErrorMessage(response, responseBody);
    throw new ApiError(errorMessage);
  }

  // There is no way to spread the response object to modify its body, so the current solution at
  // the moment is this: return the status and the body instead of the full & real response
  return fullResponse ? { status: response.status, body: responseBody } : responseBody;
};
