import React from "react";
import PropTypes from "prop-types";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import * as validation from "../services/validation";

export class InputControl extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.string,
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    adornment: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired
  };

  state = { error: null, pendingError: null };

  onChange = e => {
    const value = e.target.value;
    const error = this.props.validate(value);

    this.props.onChange(value, error);
    this.setState({
      pendingError: error,
      error: null
    });
  };

  onBlur = () => {
    const { pendingError } = this.state;
    if (pendingError) this.setState({ error: pendingError });
  };

  render() {
    const { classes, value, label, id, adornment } = this.props;
    const { error } = this.state;
    const errorId = id + "error";
    const hasError = !!error;

    return (
      <FormControl
        className={classes.formControl}
        error={hasError}
        aria-describedby={errorId}
      >
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Input
          id={id}
          value={value}
          onChange={this.onChange}
          className={classes.input}
          onBlur={this.onBlur}
          error={hasError}
          startAdornment={
            adornment && (
              <InputAdornment className={classes.adornment} position="start">
                {adornment}
              </InputAdornment>
            )
          }
        />
        {hasError && <FormHelperText id={errorId}>{error}</FormHelperText>}
      </FormControl>
    );
  }
}

export function EmailField({ classes, value, onChange }) {
  return (
    <InputControl
      classes={classes}
      value={value}
      onChange={onChange}
      validate={validation.validateEmail}
      label="Email"
      id="emailField"
    />
  );
}

export function FirstNameField({ classes, value, onChange }) {
  return (
    <InputControl
      classes={classes}
      value={value}
      onChange={onChange}
      validate={validation.validateFirstName}
      label="First Name"
      id="firstNameField"
    />
  );
}

export function UsernameField({ classes, value, onChange }) {
  return (
    <InputControl
      classes={classes}
      value={value}
      onChange={onChange}
      validate={validation.validateUsername}
      adornment="@"
      label="Username"
      id="userNameField"
    />
  );
}
