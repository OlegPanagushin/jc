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
  }
});

class Dashboard extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    wait: PropTypes.bool.isRequired,
    getDashboard: PropTypes.func.isRequired,
    pollData: PropTypes.func.isRequired
  };

  state = {
    comments: 0,
    likes: 0,
    er: 0,
    height: "100%"
  };
  postContainerRef = React.createRef();

  adjustHeight = () => {
    const post = this.postContainerRef.current;
    this.setState({ ...this.state, height: post.clientHeight + "px" });
  };

  componentDidMount() {
    this.props.getDashboard();
    this.props.pollData();
    this.adjustHeight();
    window.addEventListener("resize", () => this.adjustHeight());
  }

  render() {
    const { wait, classes } = this.props;

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
              className={classes.infoTitle}
            >
              Comments live
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
      wait: state.root.gettingDashboard
    };
  },
  {
    getDashboard,
    pollData
  }
)(withStyles(styles)(Dashboard));
