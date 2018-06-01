import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";

class ConfirmationDialog extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired
  };

  state = {
    open: false
  };

  static getDerivedStateFromProps(props, state) {
    const { open } = props;
    return {
      ...state,
      open: open === true
    };
  }

  handleCancel = () => {
    this.setState({ open: false });
    this.props.onClose(false);
  };

  handleOk = () => {
    this.setState({ open: false });
    this.props.onClose(true);
  };

  render() {
    const { title, question, ...other } = this.props;

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={this.state.open}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{question}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel}>Cancel</Button>
          <Button onClick={this.handleOk}>Ok</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmationDialog;
