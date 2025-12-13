export function parseFilters(query) {
    const { location, shift, timePeriod, time } = query || {};
  
    const resolvedTimePeriod = timePeriod ?? time ?? null;
  
    return {
      location: location || null,
      shift: shift || null,
      timePeriod: resolvedTimePeriod || null,
    };
  }
  
  export function applyFilters(records = [], { location, shift, timePeriod } = {}) {
    let out = Array.isArray(records) ? records.slice() : [];
  
    if (location) {
      out = out.filter((r) => {
        if (!r) return false;
        if (r.source_location) return String(r.source_location) === String(location);
        if (r.location) return String(r.location) === String(location);
        return false;
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
  