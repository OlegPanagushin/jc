import React from "react";
import PropTypes from "prop-types";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import CabinetPage from "./pages/CabinetPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./components/Dashboard";
import Posts from "./components/Posts";
import Notification from "./components/Notification";
import * as routes from "./constants/routes";
import { clearError } from "./actions";

const styles = theme => ({
  "@global": {
    html: {
      height: "100%"
    },
    body: {
      height: "100%",
      margin: 0,
      padding: 0
    },
    "#root": {
      height: "100%"
    },
    text: {
      ...theme.typography.caption,
      stroke: "currentColor"
    }
  },
  appContainer: {
    display: "flex",
    height: "100%",
    width: "100%"
  },
  link: {
    display: "block",
    margin: theme.spacing.unit
  }
});

function PrivateRoute({
  component: Component,
  isAuthenticated,
  title,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <CabinetPage
            title={title}
            render={props => <Component {...props} />}
          />
        ) : (
          <Redirect
            to={{
              pathname: routes.LOGIN,
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

class App extends React.Component {
  render() {
    const { classes, error, isAuthenticated, clearError } = this.props;

    return (
      <BrowserRouter>
        <div className={classes.appContainer}>
          <Switch>
            <PrivateRoute
              exact
              path={routes.DASHBOARD}
              isAuthenticated={isAuthenticated}
              component={Dashboard}
              title="Your Dashboard"
            />
            <PrivateRoute
              path={routes.POSTS}
              isAuthenticated={isAuthenticated}
              component={Posts}
              title="Your Posts"
            />
            <Route
              path={routes.LOGIN}
              render={() =>
                isAuthenticated ? (
                  <Redirect to={routes.DASHBOARD} />
                ) : (
                  <LoginPage />
                )
              }
            />
            <Redirect to={routes.DASHBOARD} />
          </Switch>
          <Notification message={error} handleClose={clearError} />
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  state => {
    return {
      error: state.root.error,
      isAuthenticated: state.auth.isAuthenticated
    };
  },
  dispatch => ({
    clearError: () => dispatch(clearError())
  })
)(withStyles(styles)(App));
