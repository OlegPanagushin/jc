import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import cn from "classnames";
import PostBlock from "../components/PostBlock";
import CommentsBlock from "../components/CommentsBlock";
import { LikesChart, CommentsChart } from "../components/Charts";
import SwitchGroup from "../components/GroupSwitch";
import CommentsTitle from "../components/CommentsTitle";

const styles = theme => ({
  layoutGrid: {
    minHeight: `calc(100% + ${theme.spacing.unit * 3}px);`
  },
  layoutSect: {
    minHeight: "100%"
  },
  commentsSect: {
    displat: "flex",
    flexDirection: "column",
    maxHeight: "100%",
    overflow: "hidden",
    padding: [0, "!important"]
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
  }
});

class Dashboard extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  state = {
    height: "100%"
  };
  postContainerRef = React.createRef();

  adjustHeight = () => {
    const post = this.postContainerRef.current;
    this.setState({ ...this.state, height: post.clientHeight + "px" });
  };

  componentDidMount() {
    this.adjustHeight();
    window.addEventListener("resize", this.adjustHeight);
  }

  render() {
    const { classes } = this.props;

    return (
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
            <SwitchGroup />
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
            <CommentsTitle />
            <Divider />
            <List style={{ overflow: "auto", height: "calc(100% - 57.4px)" }}>
              <CommentsBlock />
            </List>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Dashboard);
