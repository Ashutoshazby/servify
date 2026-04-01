const cacheStore = new Map();

export const cacheResponse =
  (ttlMs = 60 * 1000) =>
  (req, res, next) => {
    const key = `${req.originalUrl}`;
    const cached = cacheStore.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      return res.json(cached.data);
    }

    const originalJson = res.json.bind(res);
    res.json = (payload) => {
      cacheStore.set(key, { data: payload, expiresAt: Date.now() + ttlMs });
      return originalJson(payload);
    };

    next();
  };

export const clearCacheByPrefix = (prefix) => {
  Array.from(cacheStore.keys()).forEach((key) => {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  });
};
