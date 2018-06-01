import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  comment: {
    flexWrap: "wrap"
  },
  profileLink: {
    color: theme.palette.primary.main,
    textDecoration: "none   "
  },
  commentTextBlock: {
    padding: `${theme.spacing.unit * 2}px 0 0`
  },
  commentText: {
    display: "block"
  },
  replayButton: {
    marginLeft: -theme.spacing.unit - theme.spacing.unit / 2
  }
});

class CommentPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
    avatar: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    profileUrl: PropTypes.string.isRequired,
    replyUrl: PropTypes.string.isRequired
  };

  render() {
    const {
      name,
      date,
      avatar,
      text,
      profileUrl,
      replyUrl,
      classes
    } = this.props;

    return [
      <ListItem key="1" className={classes.comment}>
        <ListItemIcon>
          <Avatar alt={name} src={avatar} />
        </ListItemIcon>
        <ListItemText
          primary={
            <a
              color="primary"
              className={classes.profileLink}
              href={profileUrl}
              target="_blank"
            >
              {name}
            </a>
          }
          secondary={moment.unix(date).fromNow()}
        />
        <ListItemText
          className={classes.commentTextBlock}
          primary={[
            <span key="1" className={classes.commentText}>
              {text}
            </span>,
            <Button
              key="2"
              color="primary"
              size="small"
              className={classes.replayButton}
              href={replyUrl}
              target="_blank"
            >
              Reply
            </Button>
          ]}
        />
      </ListItem>,
      <Divider key="2" />
    ];
  }
}

export default withStyles(styles)(CommentPreview);
