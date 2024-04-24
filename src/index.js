import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./components/context/ChatProvider";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <ChatProvider>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </ChatProvider>
  </BrowserRouter>
);
