import type { AxiosInstance } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { createAxiosInstance } from "@/shared/utils";

/**
 * 200 <= status && status < 300
 * @param status
 */
const isValidResponse = (status: number) => {
  return 200 <= status && status < 300;
};

const mockToolAxiosInstance = createAxiosInstance();
const mockAxiosAdapter = new AxiosMockAdapter(
  mockToolAxiosInstance as AxiosInstance,
  {
    delayResponse: 1000,
  },
);

// mockToolAxiosInstance.interceptors.request.use((config) => {
//   const storageCurrentUser = store.get(LOCAL_STORAGE_KEY.TEMPLATE_INFO) as
//     | TemplateInfo
//     | undefined;
//   const shienToken = storageCurrentUser?.shienToken;

//   if (isString(shienToken) && shienToken.length > 0) {
//     config.headers = {
//       ...config.headers,
//       shienToken: shienToken,
//     } as unknown as AxiosRequestHeaders;
//   }

//   return config;
// });

export { isValidResponse, mockToolAxiosInstance, mockAxiosAdapter };
