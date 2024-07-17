import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import { Comment as CommentType } from '../types';
import commentClasses from './Comment.module.css';
import discussionClasses from './Discussion.module.css';
import { formatDate } from '../utils/dateUtils';
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import { getIconPath } from '@/utils/iconUtils';
import { Button, Collapse } from 'react-bootstrap';

interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [open, setOpen] = useState(false);
  const [upvoted, setUpvoted] = useState<boolean>(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleUpvoteClick = () => {
    setUpvoted(!upvoted);
    if (!upvoted) {
      comment.upvoteCount += 1;
    } else {
      comment.upvoteCount -= 1;
    }
  };

  return (
    <>
      <div className={commentClasses.comment}>
        <div className={discussionClasses.discussion_user}>
          <Avatar
            className={discussionClasses.avatar_img}
            sx={{ width: 65, height: 65 }}
            src={comment.user.image_url} />
          <div className={discussionClasses.discussion_user_info}>
            <div className={discussionClasses.discussion_row}>
              <span className={discussionClasses.nick_name}>{comment.user.nick_name}</span>
              <span className={commentClasses.skin_type}>{comment.user.skin_type}</span>
            </div>
            <span>{formatDate(comment.createdAt)}</span>
          </div>
        </div>
        <div className={commentClasses.comment_content}>
          <p>{comment.content}</p>
          {comment.image_urls.length > 0 && (
            <div className={commentClasses.comment_image}>
              {comment.image_urls.map((url, index) => (
                <Image key={index} src={url} alt="Comment Image" width={100} height={100} />
              ))}
            </div>
          )}
          <div className={discussionClasses.discussion_btn_group}>
            <Button variant="light" className={discussionClasses.upvotes} onClick={handleUpvoteClick}>
              <Image
                src={getIconPath('icon-upvote')}
                alt="Upvote icon"
                width={16}
                height={16}
              />{comment.upvoteCount} upvotes</Button>
            {hasReplies ? (
              <Button
                variant="light"
                className={discussionClasses.comment_btn}
                onClick={() => setOpen(!open)}
                aria-controls="replies-collapse"
                aria-expanded={open}>
                <Image
                  src={getIconPath('icon-comment')}
                  alt="Comment icon "
                  width={16}
                  height={16}
                />View comments ({comment.commentCount})</Button>
            ) : (
              <span className={discussionClasses.upvotes}>
                <Image
                  src={getIconPath('icon-comment')}
                  alt="Comment icon"
                  width={16}
                  height={16}
                />No comments</span>
            )}
          </div>
        </div >
        {
          comment.replies && comment.replies.length > 0 && (
            <div className={commentClasses.replies}>
              <Collapse in={open}>
                <div id="replies-collapse" >
                  <p className={commentClasses.replies_desc}>Replies:</p>
                  {comment.replies.map(reply => (
                    <Comment key={reply.id} comment={reply} />
                  ))}
                </div>
              </Collapse>
            </div>
          )
        }
      </div >
      <Divider />
    </>
  );
};

export default Comment;
