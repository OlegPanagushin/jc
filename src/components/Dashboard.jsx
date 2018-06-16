import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import teal from "@material-ui/core/colors/teal";
import blue from "@material-ui/core/colors/blue";
import cn from "classnames";
import { getDashboard, pollData } from "../actions";
import PostBlock from "../components/PostBlock";
import CommentsBlock from "../components/CommentsBlock";
import { LikesChart, CommentsChart } from "../components/Charts";

const styles = theme => ({
  layoutGrid: {
    minHeight: `calc(100% + ${theme.spacing.unit * 3}px);`
  },
  layoutSect: {
    minHeight: "100%"
  },
  commentsSect: {
    maxHeight: "100%",
    overflow: "auto"
  },
  paper: {
    height: "100%",
    padding: theme.spacing.unit * 2
  },
  progress: {
    left: "50%",
    marginLeft: -30,
    marginTop: -30,
    position: "absolute",
    top: "50%"
  },
  commentsTitle: {
    alignItems: "center",
    display: "flex"
  },
  light: {
    borderRadius: "50%",
    height: "1rem",
    margin: `0 ${theme.spacing.unit * 1.5}px`,
    transition: theme.transitions.create("background"),
    width: "1rem"
  },
  red: {
    background: red[500]
  },
  green: {
    background: green[500]
  },
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

class Dashboard extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    wait: PropTypes.bool.isRequired,
    getDashboard: PropTypes.func.isRequired,
    pollData: PropTypes.func.isRequired
  };

  state = {
    height: "100%",
    group: "24"
  };
  postContainerRef = React.createRef();

  adjustHeight = () => {
    const post = this.postContainerRef.current;
    this.setState({ ...this.state, height: post.clientHeight + "px" });
  };

  componentDidMount() {
    this.props.getDashboard(this.state.group, false);
    this.adjustHeight();
    window.addEventListener("resize", this.adjustHeight);
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
    const { wait, live, classes } = this.props;
    const { group } = this.state;

    return wait ? (
      <CircularProgress size={60} className={classes.progress} />
    ) : (
      <Grid container spacing={24} className={classes.layoutGrid}>
        <Grid
          item
          xs={8}
          className={classes.layoutSect}
          component={({ children, ...props }) => (
            <div ref={this.postContainerRef} {...props}>
              {children}
            </div>
          )}
        >
          <Paper className={classes.paper}>
            <PostBlock />
            <FormControlLabel
              className={classes.switch}
              control={
                <Switch
                  checked={group === "0"}
                  onChange={this.handleChange}
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
            <LikesChart />
            <CommentsChart />
          </Paper>
        </Grid>
        <Grid
          item
          xs={4}
          className={classes.layoutSect}
          component={({ children, ...props }) => (
            <div {...props} style={{ height: this.state.height }}>
              {children}
            </div>
          )}
        >
          <Paper className={cn(classes.paper, classes.commentsSect)}>
            <Typography
              variant="headline"
              gutterBottom
              className={classes.commentsTitle}
            >
              <React.Fragment>
                <div
                  className={cn(
                    classes.light,
                    live ? classes.green : classes.red
                  )}
                />
                Comments live
              </React.Fragment>
            </Typography>
            <Divider />
            <List>
              <CommentsBlock />
            </List>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default connect(
  state => {
    return {
      wait: state.root.fetchingDashboard,
      live: state.root.live
    };
  },
  {
    getDashboard,
    pollData
  }
)(withStyles(styles)(Dashboard));
