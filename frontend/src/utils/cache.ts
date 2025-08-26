export const getCachedData = <T = unknown>(key: string): T | null => {
  const cachedData = localStorage.getItem(key);
  if (!cachedData) return null;

  const { data, timestamp } = JSON.parse(cachedData);
  const now = new Date().getTime();
  const cacheExpiry = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (now - timestamp > cacheExpiry) {
    localStorage.removeItem(key);
    return null;
  }

  return data as T;
};

export const setCachedData = <T = unknown>(key: string, data: T) => {
  const timestamp = new Date().getTime();
  localStorage.setItem(key, JSON.stringify({ data, timestamp }));
};
