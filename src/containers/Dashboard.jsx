import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getDashboard } from "../actions";

const styles = {};

class Dashboard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    wait: PropTypes.bool.isRequired,
    dashboard: PropTypes.object.isRequired,
    getDashboard: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.getDashboard();
  }

  render() {
    const { wait, classes } = this.props;
    return wait ? (
      <CircularProgress size={60} className={classes.progress} />
    ) : (
      <div className="Dashboard">Dashboard</div>
    );
  }
}

export default connect(
  state => {
    const { gettingDashboard, dashboard } = state.rootReducer;
    return { wait: gettingDashboard === true, dashboard };
  },
  dispatch => ({
    getDashboard: () => dispatch(getDashboard())
  })
)(withStyles(styles)(Dashboard));
