import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Portrait from "@material-ui/icons/Portrait";
import cn from "classnames";

const styles = theme => ({
  imageWrapper: {},
  heightPusher: {
    paddingBottom: "100%",
    position: "relative",
    width: "100%"
  },
  progress: {
    left: "50%",
    marginLeft: -20,
    marginTop: -20,
    padding: theme.spacing.unit,
    position: "absolute",
    top: "50%"
  },
  alt: {
    color: theme.palette.grey["300"],
    height: "100%",
    left: " 50%",
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%"
  },
  img: {
    bottom: 0,
    left: 0,
    margin: "auto",
    maxHeight: "100%",
    maxWidth: "100%",
    opacity: 1,
    position: "absolute",
    right: 0,
    top: 0,
    translate: theme.transitions.create("opacity")
  },
  loading: {
    opacity: 0
  }
});

class Image extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    src: PropTypes.string,
    alt: PropTypes.string
  };

  state = {
    error: false,
    loading: true
  };

  onLoadHandler = () => {
    this.setState({
      ...this.state,
      loading: false
    });
  };

  onErrorHandler = () => {
    this.setState({
      loading: false,
      error: true
    });
  };

  render() {
    const { classes, src, alt } = this.props;
    const { error, loading } = this.state;

    return (
      <div className={classes.imageWrapper}>
        <div className={classes.heightPusher}>
          {loading && (
            <CircularProgress size={40} className={classes.progress} />
          )}
          {error ? (
            <Portrait className={classes.alt} />
          ) : (
            <img
              src={src}
              alt={alt || "Post image"}
              onLoad={this.onLoadHandler}
              onError={this.onErrorHandler}
              className={cn(classes.img, loading && classes.loading)}
            />
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Image);
