import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./redux/store/store.ts";
import { BrowserRouter } from "react-router-dom";
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
