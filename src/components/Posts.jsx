import React from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getPosts } from "../actions";

const styles = {
  loader: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    height: "100%",
    width: "100%"
  }
};

class Posts extends React.Component {
  componentDidMount() {
    this.props.getPosts();
  }

  render() {
    const { fetching, posts, classes } = this.props;

    return fetching ? (
      <div className={classes.loader}>
        <CircularProgress size={60} />
      </div>
    ) : (
      <div className="Posts">
        {posts &&
          posts.map(post => <div key={post.code}>{post.description}</div>)}
      </div>
    );
  }
}

export default connect(
  state => ({ ...state.posts }),
  { getPosts }
)(withStyles(styles)(Posts));
