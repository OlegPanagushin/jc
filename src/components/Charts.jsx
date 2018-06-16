import React from "react";
import { connect } from "react-redux";
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

const dateFormat = v =>
  moment
    .unix(v)
    .local()
    .format("h:mm");

export const LikesChart = connect(state => ({
  data: state.charts.likes
}))(({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="likes" stroke="#3f51b5" />
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="when" tickFormatter={dateFormat} scale="utcTime" />
        <YAxis tickCount={3} />
        <Tooltip labelFormatter={dateFormat} />
      </LineChart>
    </ResponsiveContainer>
  );
});

export const CommentsChart = connect(state => ({
  data: state.charts.comments
}))(({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="when" tickFormatter={dateFormat} />
        <YAxis tickCount={3} />
        <Tooltip labelFormatter={dateFormat} />
        <Bar dataKey="comments" fill="#3f51b5" />
      </BarChart>
    </ResponsiveContainer>
  );
});
