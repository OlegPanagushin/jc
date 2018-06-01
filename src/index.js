import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider } from "react-redux";
import App from "./App";
import configureStore from "./store/configureStore";
import registerServiceWorker from "./registerServiceWorker";

const store = configureStore();

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </React.Fragment>,
  document.getElementById("root")
);
registerServiceWorker();
