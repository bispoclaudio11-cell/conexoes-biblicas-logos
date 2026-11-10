/**
 * Armazenamento local do Conexões Bíblicas LOGOS.
 *
 * Os dados ficam somente neste navegador e neste perfil de usuário.
 * Não há envio para servidor nem dependência de banco de dados.
 */

const PREFIX = 'conexoes-biblicas-logos:v1:';

export type SearchRecord = {
  id: string;
  query: string;
  searchedAt: string;
};

export type FavoriteRecord = {
  id: string;
  title: string;
  reference: string;
  category: string;
  notes?: string;
  savedAt: string;
};

const keys = {
  searches: `${PREFIX}search-history`,
  favorites: `${PREFIX}favorites`,
} as const;

function readList<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, value: T[]): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Pode ocorrer quando o navegador bloqueia o armazenamento ou excede a quota.
    return false;
  }
}

function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const localStore = {
  getSearchHistory(): SearchRecord[] {
    return readList<SearchRecord>(keys.searches);
  },

  addSearch(query: string): SearchRecord[] {
    const normalized = query.trim();
    if (!normalized) return this.getSearchHistory();

    const current = this.getSearchHistory().filter(
      (item) => item.query.toLocaleLowerCase() !== normalized.toLocaleLowerCase(),
    );

    const updated = [
      { id: createId(), query: normalized, searchedAt: new Date().toISOString() },
      ...current,
    ].slice(0, 30);

    writeList(keys.searches, updated);
    return updated;
  },

  clearSearchHistory(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      window.localStorage.removeItem(keys.searches);
      return true;
    } catch {
      return false;
    }
  },

  getFavorites(): FavoriteRecord[] {
    return readList<FavoriteRecord>(keys.favorites);
  },

  addFavorite(
    favorite: Omit<FavoriteRecord, 'id' | 'savedAt'>,
  ): FavoriteRecord[] {
    const current = this.getFavorites();
    const exists = current.some(
      (item) =>
        item.reference.toLocaleLowerCase() === favorite.reference.trim().toLocaleLowerCase() &&
        item.title.toLocaleLowerCase() === favorite.title.trim().toLocaleLowerCase(),
    );

    if (exists) return current;

    const updated = [
      { ...favorite, id: createId(), savedAt: new Date().toISOString() },
      ...current,
    ];

    writeList(keys.favorites, updated);
    return updated;
  },

  removeFavorite(id: string): FavoriteRecord[] {
    const updated = this.getFavorites().filter((item) => item.id !== id);
    writeList(keys.favorites, updated);
    return updated;
  },

  clearFavorites(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      window.localStorage.removeItem(keys.favorites);
      return true;
    } catch {
      return false;
    }
  },
};
