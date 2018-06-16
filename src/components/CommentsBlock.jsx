import React from "react";
import { connect } from "react-redux";
import CommentPreview from "../components/CommentPreview";

class CommentsBlock extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   console.log(nextProps.data.lentgh === this.props.data.lentgh);
  //   return true;
  // }

  render() {
    const { data } = this.props;

    return (
      data &&
      data.map(comment => (
        <CommentPreview
          key={comment.id}
          name={comment.owner && comment.owner.username}
          date={comment.created_at}
          avatar={comment.owner && comment.owner.profile_pic_url}
          text={comment.text}
          profileUrl={comment.profile_url}
          replyUrl={comment.reply}
        />
      ))
    );
  }
}

export default connect(state => {
  return { data: state.comments };
})(CommentsBlock);
