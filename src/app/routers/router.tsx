import { createBrowserRouter } from "react-router";

import { getBaseURL } from "@/shared/utils/env";

import { Home } from "../pages/home";
import { MockDataCreate } from "../pages/mock-data-create";
import { APP_PATH } from "./app-path";

const router = createBrowserRouter(
  [
    { path: APP_PATH.ROOT, element: <MockDataCreate /> },
    { path: APP_PATH.HOME, element: <Home /> },
    { path: APP_PATH.MOCK_DATA_CREATE, element: <MockDataCreate /> },
  ],
  {
    basename: getBaseURL(),
  },
);

export { router };
