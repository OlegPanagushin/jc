import React from "react";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
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
import withStyles from "@material-ui/core/styles/withStyles";

const dateFormat = v =>
  moment
    .unix(v)
    .local()
    .format("H:mm");

const styles = {
  chart: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center"
  },
  loader: {
    padding: 4
  }
};

export const LikesChart = connect(state => ({
  data: state.charts.likes,
  wait: state.root.fetchingDashboard || state.root.updateDashboard
}))(
  withStyles(styles)(({ data, wait, classes }) => {
    return (
      <ResponsiveContainer width="100%" height={150} className={classes.chart}>
        {wait ? (
          <CircularProgress size={40} className={classes.loader} />
        ) : (
          <LineChart data={data}>
            <Line type="monotone" dataKey="likes" stroke="#3f51b5" />
            <CartesianGrid
              stroke="#ccc"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="when" tickFormatter={dateFormat} scale="utcTime" />
            <YAxis tickCount={3} />
            <Tooltip labelFormatter={dateFormat} />
          </LineChart>
        )}
      </ResponsiveContainer>
    );
  })
);

export const CommentsChart = connect(state => ({
  data: state.charts.comments,
  wait: state.root.fetchingDashboard || state.root.updateDashboard
}))(
  withStyles(styles)(({ data, wait, classes }) => {
    return (
      <ResponsiveContainer width="100%" height={150} className={classes.chart}>
        {wait ? (
          <CircularProgress size={40} className={classes.loader} />
        ) : (
          <BarChart data={data}>
            <CartesianGrid
              stroke="#ccc"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="when" tickFormatter={dateFormat} />
            <YAxis tickCount={3} />
            <Tooltip labelFormatter={dateFormat} />
            <Bar dataKey="comments" fill="#3f51b5" />
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  })
);
