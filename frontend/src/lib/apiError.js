function normalizeLeafMessage(message) {
  if (typeof message !== "string") {
    return null;
  }

  const trimmed = message.trim();
  return trimmed || null;
}

function collectMessages(value, prefix = "") {
  if (value == null) {
    return [];
  }

  if (typeof value === "string") {
    const message = normalizeLeafMessage(value);
    return message ? [prefix ? `${prefix}: ${message}` : message] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectMessages(item, prefix));
  }

  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, nextValue]) => {
      if (key === "detail") {
        return collectMessages(nextValue, prefix);
      }

      if (key === "non_field_errors") {
        return collectMessages(nextValue, prefix);
      }

      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      return collectMessages(nextValue, nextPrefix);
    });
  }

  return [];
}

export function getApiErrorMessage(error, fallbackMessage, networkMessage) {
  const isNetworkFailure = error?.message === "Network Error" || !error?.response;
  if (isNetworkFailure) {
    return networkMessage;
  }

  const messages = collectMessages(error?.response?.data);
  if (messages.length > 0) {
    return messages.join(" ");
  }

  return fallbackMessage;
}
