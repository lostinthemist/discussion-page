import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import { Comment as CommentType } from '../types';
import commentClasses from './Comment.module.css';
import discussionClasses from './Discussion.module.css';
import { formatDate } from '../utils/dateUtils';
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import { getIconPath } from '@/utils/iconUtils';
import { Button, Collapse, Form, Alert } from 'react-bootstrap';

interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [open, setOpen] = useState(false);
  const [upvoted, setUpvoted] = useState<boolean>(false);
  const [showAddReply, setShowAddReply] = useState(false);
  const [newReply, setNewReply] = useState({ content: '', image_urls: '' });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [replies, setReplies] = useState<CommentType[]>(comment.replies || []);
  const [replyCount, setReplyCount] = useState<number>(replies.length);

  const handleUpvoteClick = () => {
    setUpvoted(!upvoted);
    if (!upvoted) {
      comment.upvoteCount += 1;
    } else {
      comment.upvoteCount -= 1;
    }
  };

  const handleAddReplyClick = () => {
    setShowAddReply(prevShowAddReply => {
      if (prevShowAddReply) {
        setNewReply({ content: '', image_urls: '' }); 
      }
      return !prevShowAddReply;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReply(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReply.content) {
      setValidationError('Content is a required field.');
      return;
    }

    const newReplyData: CommentType = {
      id: Math.max(0, ...replies.map(reply => reply.id)) + 1,
      discussionId: comment.discussionId, 
      content: newReply.content,
      image_urls: newReply.image_urls.split(',').map(url => url.trim()).filter(url => url),
      viewCount: 0,
      upvoteCount: 0,
      commentCount: 0,
      category: comment.category,
      user: {
        id: 44,
        image_url: 'https://picky-app.s3-ap-southeast-1.amazonaws.com/users/44444.202141131010.jpg',
        nick_name: 'Squad Current User',
        skin_type: 'Smooth'
      },
      createdAt: new Date().toISOString(),
      replies: []
    };

    setReplies(prevReplies => [...prevReplies, newReplyData]);
    setReplyCount(prevCount => prevCount + 1);

    setNewReply({ content: '', image_urls: '' });
    setShowAddReply(false);
    setValidationError(null);
  };

  const hasReplies = replies.length > 0;

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
                <Image key={index} src={url} alt="Comment Image" width={150} height={150} />
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
            <Button
              variant="light"
              className={discussionClasses.comment_btn}
              onClick={handleAddReplyClick}>{showAddReply ? "Cancel reply" : "Add reply"}</Button>
            {hasReplies ? (
              <Button
                variant="light"
                className={discussionClasses.comment_btn}
                onClick={() => setOpen(!open)}
                aria-controls="replies-collapse"
                aria-expanded={open}>
                <Image
                  src={getIconPath('icon-comment')}
                  alt="Comment icon"
                  width={16}
                  height={16}
                />View replies ({replyCount})</Button>
            ) : (
              <span className={discussionClasses.upvotes}>
                <Image
                  src={getIconPath('icon-comment')}
                  alt="Comment icon"
                  width={16}
                  height={16}
                />No replies</span>
            )}
          </div>
          <Collapse in={showAddReply}>
            <div id="add-reply-collapse" className={discussionClasses.add_comment}>
              <Form onSubmit={handleFormSubmit}>
                {validationError && <Alert variant="danger">{validationError}</Alert>}
                <Form.Group controlId="replyContent">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder='Write your reply here...'
                    rows={3}
                    name="content"
                    value={newReply.content}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="replyImageUrls">
                  <Form.Label>Image URLs (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="https://www..."
                    name="image_urls"
                    value={newReply.image_urls}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button variant="light" type="submit" className={discussionClasses.add_comment_btn} >
                  Submit
                </Button>
              </Form>
            </div>
          </Collapse>
        </div>
        {
          hasReplies && (
            <div className={commentClasses.replies}>
              <Collapse in={open}>
                <div id="replies-collapse">
                  <p className={commentClasses.replies_desc}>Replies:</p>
                  {replies.map(reply => (
                    <Comment key={reply.id} comment={reply} />
                  ))}
                </div>
              </Collapse>
            </div>
          )
        }
      </div>
      <Divider />
    </>
  );
};

export default Comment;
