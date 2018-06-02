import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import { EmailField, FirstNameField, UsernameField } from "../components/Field";
import { signupRequest, checkToken, saveUsername, setError } from "../actions";

const styles = theme => ({
  form: {
    display: "flex",
    flexDirection: "column",
    margin: `${theme.spacing.unit * 4}px auto`,
    maxWidth: "100%",
    padding: `0 ${theme.spacing.unit * 2}px`,
    textAlign: "left",
    width: 350
  },
  formControl: {
    display: "block",
    margin: `${theme.spacing.unit * 2}px 0`,
    width: "100%"
  },
  input: {
    width: "100%"
  },
  adornment: {
    marginRight: 0
  },
  button: {
    alignSelf: "flex-end",
    margin: `${theme.spacing.unit * 2}px 0`
  },
  progress: {
    margin: theme.spacing.unit * 4,
    alignSelf: "center"
  }
});

class LoginPage extends React.Component {
  state = {
    email: { value: "" },
    firstName: { value: "" },
    username: { value: "" },
    saveEnable: false
  };

  handleChange = name => (value, error) => {
    this.setState({
      [name]: { value, error },
      saveEnable: true
    });
  };

  saveClick = () => {
    const { specifyUserName } = this.props;
    const { email, firstName, username } = this.state;

    if (specifyUserName) {
      if (!username.error) {
        this.props.saveUsername(username.value);
        return;
      }
    } else {
      if (!email.error && !firstName.error && !username.error) {
        this.props.register(email.value, firstName.value, username.value);
        return;
      }
    }
    this.props.setError("Please fix validation errors");
  };

  componentDidMount() {
    this.props.checkToken();
  }

  render() {
    const { classes, wait, specifyUserName } = this.props;
    const { email, firstName, username, saveEnable } = this.state;

    return (
      <form className={classes.form} noValidate autoComplete="off">
        <Typography variant="display1" gutterBottom align="center">
          Welcome
        </Typography>
        {wait ? (
          <CircularProgress size={60} className={classes.progress} />
        ) : (
          [
            !specifyUserName && [
              <EmailField
                key="1"
                classes={classes}
                onChange={this.handleChange("email")}
                value={email.value}
              />,
              <FirstNameField
                key="2"
                classes={classes}
                onChange={this.handleChange("firstName")}
                value={firstName.value}
              />
            ],
            <UsernameField
              key="3"
              classes={classes}
              onChange={this.handleChange("username")}
              value={username.value}
            />,
            <Button
              key="4"
              onClick={this.saveClick}
              className={classes.button}
              variant="raised"
              size="medium"
              disabled={!saveEnable}
            >
              {specifyUserName ? "Save" : "Register"}
            </Button>
          ]
        )}
      </form>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  wait: PropTypes.bool.isRequired,
  specifyUserName: PropTypes.bool.isRequired
};

export default connect(
  state => {
    const {
      checkingToken,
      savingUserName,
      gettingToken,
      userNameCheckFail
    } = state.rootReducer;
    return {
      wait: checkingToken || savingUserName || gettingToken,
      specifyUserName: userNameCheckFail === true
    };
  },
  dispatch => ({
    register: (email, userName, username) =>
      dispatch(signupRequest(email, userName, username)),
    saveUsername: username => dispatch(saveUsername(username)),
    checkToken: () => dispatch(checkToken()),
    setError: error => dispatch(setError(error))
  })
)(withStyles(styles)(LoginPage));
