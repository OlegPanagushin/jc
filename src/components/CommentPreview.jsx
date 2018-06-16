import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Image from "./Image";

const styles = theme => ({
  comment: {
    flexWrap: "wrap"
  },
  profileLink: {
    color: theme.palette.primary.main,
    textDecoration: "none   "
  },
  commentTextBlock: {
    padding: `${theme.spacing.unit * 2}px 0 0`,
    width: "100%"
  },
  commentText: {
    display: "block",
    wordWrap: "break-word"
  },
  replayButton: {
    marginLeft: -theme.spacing.unit - theme.spacing.unit / 2
  },
  avatar: {
    height: 40,
    overflow: "hidden",
    width: 40
  }
});

const tagRegex = /\B(#[A-Z0-9\-._]+\b)(?!;)/gi;
const userNameRegex = /^@[a-zA-Z0-9]+([ ]?[a-zA-Z0-9])*$/;

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

  getHastagUrl(tag) {
    return `https://www.instagram.com/explore/tags/${tag.replace("#", "")}`;
  }

  getUserUrl(username) {
    return `https://www.instagram.com/${username}`;
  }

  renderTextWithTags(text) {
    const segs = text.split(" ");
    let tagsCount = 0;
    return segs.map(seg => [
      seg.match(tagRegex) ? (
        <a key={tagsCount++} href={this.getHastagUrl(seg)} target="_blank">
          {seg}
        </a>
      ) : seg.match(userNameRegex) ? (
        <a
          key={tagsCount++}
          href={this.getUserUrl(seg.slice(1))}
          target="_blank"
        >
          {seg}
        </a>
      ) : (
        seg
      ),
      " "
    ]);
  }

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
          {/* <Avatar alt={name} src={avatar} /> */}
          <div className={classes.avatar}>
            <Image src={avatar} alt={name} />
          </div>
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
          secondary={moment
            .unix(date)
            .local()
            .fromNow()}
        />
        <ListItemText
          className={classes.commentTextBlock}
          primary={[
            <span key="1" className={classes.commentText}>
              {(text && text.includes("#")) || text.includes("@")
                ? this.renderTextWithTags(text)
                : text}
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
