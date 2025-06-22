import { useEffect } from "react";

import { useLocalStorageState } from "ahooks";

import { getApiServerURL, isNullable } from "@/shared/utils";

import { mockAxiosAdapter } from "../apis/axios-instance";
import { LOCAL_STORAGE_KEY, Mock } from "../constants/storage";

const registerAxiosMock = (url: string, responseData: unknown) => {
  // remove leading and trailing slashes from url
  const normalizedUrl = url.replace(/\/+$/, "").replace(/^\/+/, "");

  const apiServerURL = getApiServerURL();

  const fullUrl = apiServerURL.endsWith("/")
    ? apiServerURL + normalizedUrl
    : apiServerURL + "/" + normalizedUrl;

  mockAxiosAdapter.onPost(fullUrl).reply(200, responseData);
};

const useGlobalMockRegister = () => {
  const [localStorageMockApi] = useLocalStorageState<Mock>(
    LOCAL_STORAGE_KEY.MOCK_API,
    {
      listenStorageChange: true,
    },
  );

  useEffect(() => {
    // reset stale
    mockAxiosAdapter.resetHandlers();

    if (!isNullable(localStorageMockApi)) {
      const { mockApi } = localStorageMockApi;

      if (!isNullable(mockApi)) {
        Object.entries(mockApi).forEach(([path, mockData]) => {
          registerAxiosMock(path, mockData);
        });
      }
    }
  }, [localStorageMockApi]);
};

export { useGlobalMockRegister };
