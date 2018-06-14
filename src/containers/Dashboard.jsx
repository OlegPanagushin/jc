import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ChatBubbleOutline from "@material-ui/icons/ChatBubbleOutline";
import Star from "@material-ui/icons/Star";
import cn from "classnames";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Tooltip,
  Bar
} from "recharts";
import moment from "moment";
import { getDashboard, pollData } from "../actions";
import Image from "../components/Image";
import CommentPreview from "../components/CommentPreview";

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

class Dashboard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    wait: PropTypes.bool.isRequired,
    post: PropTypes.object.isRequired,
    likesChartData: PropTypes.array.isRequired,
    commentsChartData: PropTypes.array.isRequired,
    commentsData: PropTypes.array.isRequired,
    getDashboard: PropTypes.func.isRequired,
    pollData: PropTypes.func.isRequired
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

  dateFormat = v =>
    moment
      .unix(v)
      .local()
      .format("h:mm");

  componentDidMount() {
    this.props.getDashboard();
    //this.props.pollData();
  }

  render() {
    const {
      wait,
      classes,
      likesChartData,
      commentsChartData,
      commentsData,
      post
    } = this.props;
    const { comments, likes, er, commentsCls, likesCls, erCls } = this.state;

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
                      <ChatBubbleOutline className={classes.infoPartIcon} />{" "}
                      Total comments
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

            <ResponsiveContainer
              className={classes.firstChart}
              width="100%"
              height={200}
            >
              <BarChart data={commentsChartData}>
                <CartesianGrid
                  stroke="#ccc"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="when" tickFormatter={this.dateFormat} />
                <YAxis tickCount={3} />
                <Tooltip labelFormatter={this.dateFormat} />
                <Bar dataKey="comments" fill="#3f51b5" />
              </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={likesChartData}>
                <Line type="monotone" dataKey="likes" stroke="#3f51b5" />
                <CartesianGrid
                  stroke="#ccc"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="when"
                  tickFormatter={this.dateFormat}
                  scale="utcTime"
                />
                <YAxis tickCount={3} />
                <Tooltip labelFormatter={this.dateFormat} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={4} className={classes.layoutSect}>
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
              {commentsData.map(post => (
                <CommentPreview
                  key={post.id}
                  name={post.owner.username}
                  date={post.created_at}
                  avatar={post.owner.profile_pic_url}
                  text={post.text}
                  profileUrl={post.profile_url}
                  replyUrl={post.reply}
                />
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default connect(
  state => {
    const {
      gettingDashboard,
      post,
      commentsData,
      commentsChartData,
      likesChartData
    } = state.rootReducer;
    return {
      wait: gettingDashboard === true,
      post,
      commentsData,
      commentsChartData,
      likesChartData
    };
  },
  dispatch => ({
    getDashboard: () => dispatch(getDashboard()),
    pollData: () => dispatch(pollData())
  })
)(withStyles(styles)(Dashboard));
