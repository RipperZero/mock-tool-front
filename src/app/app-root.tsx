import { FC } from "react";
import { RouterProvider } from "react-router/dom";

import { App, ConfigProvider } from "antd";

import { StyleProvider } from "@ant-design/cssinjs";

import { ErrorBoundary } from "./error-boundary";
import { useGlobalMockRegister } from "./hooks/useGlobalMockRegister";
import { router } from "./routers/router";

type AppRootProps = unknown;

const AppRoot: FC<AppRootProps> = () => {
  // #region hooks start
  useGlobalMockRegister();
  // #endregion hooks end

  // #region useEffect functions start
  // #endregion useEffect functions end

  // #region logic functions start
  // #endregion logic functions end

  // #region render functions start
  return (
    <ErrorBoundary>
      <ConfigProvider>
        <StyleProvider hashPriority="high">
          <App>
            <RouterProvider router={router} />
          </App>
        </StyleProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
  // #endregion render functions end
};

export type { AppRootProps };
export { AppRoot };
