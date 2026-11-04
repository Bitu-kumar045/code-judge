// Utility for managing per-user data isolation across localStorage
// Ensures that every Gmail / user account has its own isolated data bucket for:
// - Solved problems
// - Submissions history
// - Level & topic metrics
// - Personal notes
// - Learning progress

export function getCurrentUser() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getCurrentUserKey() {
  try {
    const user = getCurrentUser();
    if (user?.email) return user.email.toLowerCase().trim();
    if (user?.username) return user.username.toLowerCase().trim();
  } catch {}
  return 'guest';
}

export function getUserStorageKey(baseKey) {
  const userKey = getCurrentUserKey();
  return `${baseKey}_${userKey}`;
}

/**
 * Reads a value from localStorage scoped to the currently logged in user/Gmail.
 * Automatically performs backward compatibility migration from legacy global keys.
 */
export function getScopedItem(baseKey, fallback = null) {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const userKey = getCurrentUserKey();
    const scopedKey = `${baseKey}_${userKey}`;
    const val = localStorage.getItem(scopedKey);
    if (val !== null) return val;

    // Backward compatibility: If no scoped data exists yet for this user,
    // check if legacy global key has data and migrate it to this user's account.
    if (userKey !== 'guest') {
      const legacyVal = localStorage.getItem(baseKey);
      if (legacyVal !== null) {
        localStorage.setItem(scopedKey, legacyVal);
        return legacyVal;
      }
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Saves a value into localStorage scoped strictly to the current user/Gmail.
 */
export function setScopedItem(baseKey, value) {
  try {
    if (typeof localStorage === 'undefined') return;
    const userKey = getCurrentUserKey();
    const scopedKey = `${baseKey}_${userKey}`;
    const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(scopedKey, stringVal);
  } catch (err) {
    console.warn(`[Storage] Failed to set scoped key "${baseKey}":`, err);
  }
}

/**
 * Removes a scoped item.
 */
export function removeScopedItem(baseKey) {
  try {
    if (typeof localStorage === 'undefined') return;
    const userKey = getCurrentUserKey();
    const scopedKey = `${baseKey}_${userKey}`;
    localStorage.removeItem(scopedKey);
  } catch {}
}

