import React from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import cn from "classnames";

const styles = theme => ({
  commentsTitle: {
    alignItems: "center",
    display: "flex",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px 0`
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
  }
});

export default connect(state => ({ live: state.root.live }))(
  withStyles(styles)(({ classes, live }) => {
    return (
      <Typography
        variant="headline"
        gutterBottom
        className={classes.commentsTitle}
      >
        <React.Fragment>
          <div
            className={cn(classes.light, live ? classes.green : classes.red)}
          />
          Comments {live && "live"}
        </React.Fragment>
      </Typography>
    );
  })
);
