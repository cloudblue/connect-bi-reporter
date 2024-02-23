export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const buildErrorMessage = (response, responseBody) => {
  let errorMessage = `Error ${response.status}: ${response.statusText}.`;

  if (responseBody) {
    if (responseBody.error_code) {
      errorMessage += ` Error code: ${responseBody.error_code}.`;
    }
    if (responseBody.errors) {
      responseBody.errors.map((err) => {
        errorMessage += ` ${err}`;
      });
    }
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
  const options = { method };
  if (body) {
    options.body = body;
  }

  const response = await fetch(endpoint, options);
  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const errorMessage = buildErrorMessage(response, responseBody);
    throw new ApiError(errorMessage);
  }

  return fullResponse ? { ...response, body: responseBody } : responseBody;
};
