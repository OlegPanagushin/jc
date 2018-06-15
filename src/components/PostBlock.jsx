import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ChatBubbleOutline from "@material-ui/icons/ChatBubbleOutline";
import Star from "@material-ui/icons/Star";
import Typography from "@material-ui/core/Typography";
import cn from "classnames";
import Image from "../components/Image";

const styles = theme => ({
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
  },
  firstChart: {
    marginTop: theme.spacing.unit * 4
  },
  infoPartFigure: {
    animationDuration: 800,
    animationTimingFunction: theme.transitions.easing.easeInOut,
    transformOrigin: "left center"
  },
  grow: {
    animationName: "grow"
  },
  lose: {
    animationName: "lose"
  },
  "@keyframes grow": {
    from: {
      color: "initial"
    },
    "50%": {
      color: "green",
      transform: "scale(1.3)"
    }
  },
  "@keyframes lose": {
    from: {
      color: "initial"
    },
    "50%": {
      color: "red",
      transform: "scale(1.3)"
    }
  }
});

function growOrLose(name, props, state) {
  if (!(name in props.post)) return;

  const propValue = props.post[name];
  const stateValue = state[name];

  return stateValue === propValue
    ? null
    : propValue > stateValue
      ? props.classes.grow
      : props.classes.lose;
}

class DashboardPost extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
  };

  static getDerivedStateFromProps(props, state) {
    const { post } = props;
    return {
      comments: +post.comments || 0,
      likes: +post.likes || 0,
      er: +post.er || 0,
      commentsCls: growOrLose("comments", props, state),
      likesCls: growOrLose("likes", props, state),
      erCls: growOrLose("er", props, state)
    };
  }
  state = {
    comments: 0,
    likes: 0,
    er: 0
  };

  render() {
    const { comments, likes, er, commentsCls, likesCls, erCls } = this.state;
    const { classes, post } = this.props;

    return (
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
              <Typography
                variant="display1"
                gutterBottom
                className={cn(classes.infoPartFigure, likesCls)}
              >
                {likes}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="title"
                gutterBottom
                className={classes.infoPartTitle}
              >
                <ChatBubbleOutline className={classes.infoPartIcon} /> Total
                comments
              </Typography>
              <Typography
                variant="display1"
                gutterBottom
                className={cn(classes.infoPartFigure, commentsCls)}
              >
                {comments}
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
              <Typography
                variant="display1"
                gutterBottom
                className={cn(classes.infoPartFigure, erCls)}
              >
                {Math.ceil(er * 100) / 100}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default connect(state => {
  return { post: state.post };
})(withStyles(styles)(DashboardPost));
