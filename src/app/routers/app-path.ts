const BASEURL = "/";

const APP_PATH = {
  ROOT: BASEURL,
  HOME: `${BASEURL}home`,
  MOCK_DATA_CREATE: `${BASEURL}mock-data-create`,
} as const;

export { APP_PATH };
