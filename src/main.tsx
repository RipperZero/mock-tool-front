// react-scan must be imported before React and React DOM
// import { scan } from "react-scan";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";

import "@ant-design/v5-patch-for-react-19";

import { AppRoot } from "./app/app-root";
import "./main.css";

// scan({
//   enabled: import.meta.env.DEV,
// });

let root: Root | undefined = undefined;

const render = () => {
  const rootContainer = document.getElementById("mock-tool-front");

  if (rootContainer === null) {
    return;
  }

  root = createRoot(rootContainer);

  root.render(
    <StrictMode>
      <AppRoot />
    </StrictMode>,
  );
};

render();
