import React from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import teal from "@material-ui/core/colors/teal";
import blue from "@material-ui/core/colors/blue";
import { switchGroup, pollData, getDashboard } from "../actions";

const styles = theme => ({
  switch: {
    margin: theme.spacing.unit * 2,
    width: "100%"
  },
  colorSwitchBase: {
    color: teal[500],
    "& + $colorBar": {
      backgroundColor: teal[500]
    },
    "&$colorChecked": {
      color: blue[500],
      "& + $colorBar": {
        backgroundColor: blue[500]
      }
    }
  },
  colorBar: {},
  colorChecked: {}
});

class GroupSwitch extends React.Component {
  state = {
    group: "24"
  };
  componentDidMount() {
    this.props.getDashboard();
  }

  handleChange = () => {
    const group = this.state.group === "0" ? "24" : "0";
    this.setState({
      ...this.state,
      group: group
    });
    this.props.getDashboard(group, true);
    if (group === "0") this.props.pollData();
  };

  render() {
    const { classes, disable } = this.props;
    const { group } = this.state;

    return (
      <FormControlLabel
        className={classes.switch}
        control={
          <Switch
            checked={group === "0"}
            onChange={this.handleChange}
            disabled={disable}
            value={group}
            classes={{
              switchBase: classes.colorSwitchBase,
              checked: classes.colorChecked,
              bar: classes.colorBar
            }}
          />
        }
        label={group === "0" ? "1 hour" : "24 hour"}
      />
    );
  }
}

export default connect(
  state => ({
    disable: state.root.fetchingDashboard || state.root.updateDashboard
  }),
  { switchGroup, pollData, getDashboard }
)(withStyles(styles)(GroupSwitch));
