function normalizeLocation(location) {
  if (!location) return null;
  return String(location)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_");
}

export function parseFilters(query = {}) {
  const { location, shift, timePeriod, time } = query || {};

  const resolvedTimePeriod = timePeriod ?? time ?? null;

  return {
    location: normalizeLocation(location),
    shift: shift ?? null,
    timePeriod: resolvedTimePeriod ?? null,
  };
}

export function applyFilters(records = [], { location, shift, timePeriod } = {}) {
  let out = Array.isArray(records) ? records.slice() : [];

  const loc = normalizeLocation(location);

  if (loc) {
    out = out.filter((r) => {
      if (!r) return false;

      const rLoc = normalizeLocation(r.source_location ?? r.location);
      return rLoc === loc;
    });
  }

  if (shift) {
    out = out.filter((r) => String(r.shift) === String(shift));
  }

  if (timePeriod) {
    const t = String(timePeriod).toLowerCase();

    if (t === "daily") out = out.slice(-1);
    if (t === "weekly") out = out.slice(-7);
    if (t === "monthly") out = out.slice(-30);
  }

  return out;
}
