const LOCAL_STORAGE_KEY = {
  MOCK_API: "mock_api",
} as const;

type LocalStorageKey =
  (typeof LOCAL_STORAGE_KEY)[keyof typeof LOCAL_STORAGE_KEY];

// type MockApi = Array<{
//   path: string;
//   data: unknown;
// }>;
/**
 * key → url path
 * value → mock data
 */
type MockApi = Record<string, unknown>;

type Mock = Partial<{
  updateAt: number;
  mockApi: MockApi;
}>;

const SESSION_STORAGE_KEY = {} as const;

type SessionStorageKey =
  (typeof SESSION_STORAGE_KEY)[keyof typeof SESSION_STORAGE_KEY];

export type { LocalStorageKey, SessionStorageKey, MockApi, Mock };
export { LOCAL_STORAGE_KEY, SESSION_STORAGE_KEY };
