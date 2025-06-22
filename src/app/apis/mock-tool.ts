import { TestMockAPIIOResObj } from "@api.mockTool";

import { mockToolAxiosInstance } from "./axios-instance";

const testMockAPIIO = () => {
  return mockToolAxiosInstance.get<TestMockAPIIOResObj>("/patientList");
};

const testZero = () => {
  return mockToolAxiosInstance.post<unknown>("/zero");
};

export { testMockAPIIO, testZero };
