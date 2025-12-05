export function parseFilters(query) {
    const { location, shift, time } = query || {};
    return { location: location || null, shift: shift || null, time: time || null };
}

export function applyFilters(records = [], { location, shift, time } = {}) {
    let out = Array.isArray(records) ? records.slice() : [];

    if (location) {
        out = out.filter(r => {
            if (!r) return false;
            if (r.source_location) return String(r.source_location) === String(location);
            if (r.location) return String(r.location) === String(location);
            return r.location === location || r.source_location === location;
        });
    }

    if (shift) {
        out = out.filter(r => r.shift == shift || r.shift === shift);
    }

    if (time) {
        if (time === "daily") out = out.slice(-1);
        if (time === "weekly") out = out.slice(-7);
        if (time === "monthly") out = out.slice(-30);
    }

    return out;
}
