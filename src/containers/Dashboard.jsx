import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ChatBubbleOutline from "@material-ui/icons/ChatBubbleOutline";
import Star from "@material-ui/icons/Star";
import cn from "classnames";
import { getDashboard } from "../actions";
import Image from "../components/Image";

const styles = theme => ({
  layoutGrid: {
    minHeight: "100%"
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
    position: "relative",
    top: "50%"
  },
  infoTitle: {
    marginBottom: theme.spacing.unit * 2
  },
  infoPartTitle: {
    display: "flex",
    alignItems: "center"
  },
  infoPartIcon: {
    fontSize: "1.3rem",
    marginRight: 8
  }
});

class Dashboard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    wait: PropTypes.bool.isRequired,
    post: PropTypes.object.isRequired,
    stat: PropTypes.array.isRequired,
    comments: PropTypes.array.isRequired,
    getDashboard: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.getDashboard();
  }

  render() {
    const { wait, classes, post, stat, comments } = this.props;
    console.log(post, stat, comments);
    return wait ? (
      <CircularProgress size={60} className={classes.progress} />
    ) : (
      <Grid container spacing={24} className={classes.layoutGrid}>
        <Grid item xs={8} className={classes.layoutSect}>
          <Paper className={classes.paper}>
            <Grid container spacing={16}>
              <Grid item xs={4}>
                <Image src={post.image} />
              </Grid>
              <Grid item xs={8}>
                <Typography
                  variant="headline"
                  gutterBottom
                  className={classes.infoTitle}
                >
                  Last post dynamics / online monitoring
                </Typography>
                <Grid container spacing={16}>
                  <Grid item xs={6}>
                    <Typography
                      variant="title"
                      gutterBottom
                      className={classes.infoPartTitle}
                    >
                      <ThumbUp className={classes.infoPartIcon} /> Total likes
                    </Typography>
                    <Typography variant="display1" gutterBottom>
                      {post.likes || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="title"
                      gutterBottom
                      className={classes.infoPartTitle}
                    >
                      <ChatBubbleOutline className={classes.infoPartIcon} />{" "}
                      Total comments
                    </Typography>
                    <Typography variant="display1" gutterBottom>
                      {post.comments || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="title"
                      gutterBottom
                      className={classes.infoPartTitle}
                    >
                      <Star className={classes.infoPartIcon} /> Engagement rate
                    </Typography>
                    <Typography variant="display1" gutterBottom>
                      {post.er ? Math.ceil(post.er * 100) / 100 : 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={4} className={classes.layoutSect}>
          <Paper className={cn(classes.paper, classes.commentsSect)}>
            Comments
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default connect(
  state => {
    const { gettingDashboard, post, stat, comments } = state.rootReducer;
    return { wait: gettingDashboard === true, post, stat, comments };
  },
  dispatch => ({
    getDashboard: () => dispatch(getDashboard())
  })
)(withStyles(styles)(Dashboard));
