import React, { useState } from 'react';
import Comment from './Comment';
import { Avatar } from '@mui/material';
import { Discussion as DiscussionType, Comment as CommentType } from '../types';
import discussionClasses from './Discussion.module.css';
import { Button, Collapse, Form, Alert } from 'react-bootstrap';
import ImageGallery from './Gallery';
import Image from 'next/image';
import { getIconPath } from '../utils/iconUtils';
import { formatDate } from '../utils/dateUtils';
import { useBookmarks } from '../context/BookmarkContext';

interface DiscussionProps {
    discussion: DiscussionType;
    initialComments: CommentType[];
}

const Discussion: React.FC<DiscussionProps> = ({ discussion, initialComments }) => {
    const [comments, setComments] = useState<CommentType[]>(initialComments);
    const [open, setOpen] = useState(false);
    const [showAddComment, setShowAddComment] = useState(false);
    const [newComment, setNewComment] = useState({ title: '', content: '', image_urls: '' });
    const [validationError, setValidationError] = useState<string | null>(null);
    const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
    const [commentCount, setCommentCount] = useState<number>(comments.length);
    const [upvoted, setUpvoted] = useState<boolean>(false);

    const isBookmarked = bookmarks.includes(discussion.id);
    const handleBookmarkClick = () => {
        if (isBookmarked) {
            removeBookmark(discussion.id);
        } else {
            addBookmark(discussion.id);
        }
    };

    const handleAddCommentClick = () => {
        setShowAddComment(prevShowAddComment => {
            if (prevShowAddComment) {
                setNewComment({ title: '', content: '', image_urls: '' }); 
            }
            return !prevShowAddComment;
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewComment(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.title || !newComment.content) {
            setValidationError('Title and Content are required fields.');
            return;
        }

        const newCommentData: CommentType = {
            id: Math.max(...comments.map(comment => comment.id)) + 1,
            content: newComment.content,
            image_urls: newComment.image_urls.split(',').map(url => url.trim()).filter(url => url),
            viewCount: 0,
            upvoteCount: 0,
            commentCount: 0,
            category: discussion.category,
            user: {
                id: 44,
                image_url: 'https://picky-app.s3-ap-southeast-1.amazonaws.com/users/44444.202141131010.jpg',
                nick_name: 'Squad Current User',
                skin_type: 'Smooth'
            },
            createdAt: new Date().toISOString(),
            replies: []
        };

        setComments(prevComments => [...prevComments, newCommentData]);
        setCommentCount(prevCount => prevCount + 1);

        setNewComment({ title: '', content: '', image_urls: '' });
        setShowAddComment(false);
        setValidationError(null);
    };

    const handleUpvoteClick = () => {
        setUpvoted(!upvoted);
        if (!upvoted) {
            discussion.upvoteCount += 1;
        } else {
            discussion.upvoteCount -= 1;
        }
    };

    return (
        <main>
            <article className={discussionClasses.discussion_item}>
                <div className={discussionClasses.discussion_row}>
                    <span className={discussionClasses.category}>{discussion.category.label}</span>
                    <span className={discussionClasses.desc}>{discussion.viewCount} views</span>
                    <Button
                        variant="light"
                        className={`${discussionClasses.favorite_btn} ${isBookmarked ? discussionClasses.bookmarked : ''}`}
                        onClick={handleBookmarkClick}>
                        <Image
                            src={getIconPath('icon-bookmark')}
                            alt="Favorite icon"
                            width={16}
                            height={16}
                        /></Button>
                </div>
                <div className={discussionClasses.discussion_user}>
                    <Avatar
                        className={discussionClasses.avatar_img}
                        sx={{ width: 65, height: 65 }}
                        src={discussion.user.image_url} />
                    <div className={discussionClasses.discussion_user_info}>
                        <div className={discussionClasses.discussion_row}>
                            <span className={discussionClasses.nick_name}>{discussion.user.nick_name}</span>
                            <span className={discussionClasses.skin_type}>{discussion.user.skin_type}</span>
                        </div>
                        <span>{formatDate(discussion.createdAt)}</span>
                    </div>
                </div>
                <div className={discussionClasses.discussion_content}>
                    <h2>{discussion.title}</h2>
                    <p>{discussion.content}</p>
                    <ImageGallery imageUrls={discussion.image_urls} />
                    <div className={discussionClasses.discussion_btn_group}>
                        <Button
                            variant="light" className={discussionClasses.upvotes} onClick={handleUpvoteClick}>
                            <Image

                                src={getIconPath('icon-upvote')}
                                alt="Upvote icon"
                                width={16}
                                height={16}
                            />{discussion.upvoteCount} upvotes</Button>
                        <Button
                            variant="light"
                            className={discussionClasses.comment_btn}
                            onClick={() => setOpen(!open)}
                            aria-controls="comments-collapse"
                            aria-expanded={open}>
                            <Image
                                src={getIconPath(open ? 'icon-up-big' : 'icon-down-big')}
                                alt="Arrow icon"
                                width={16}
                                height={16}
                            />View comments ({commentCount})</Button>
                        <Button
                            variant="light"
                            className={discussionClasses.comment_btn}
                            onClick={handleAddCommentClick}>{showAddComment ? "Cancel comment" : "Add comment"}</Button>
                    </div>
                    <Collapse in={showAddComment}>
                        <div id="add-comment-collapse" className={discussionClasses.add_comment}>
                            <Form onSubmit={handleFormSubmit}>
                                {validationError && <Alert variant="danger">{validationError}</Alert>}
                                <Form.Group controlId="commentTitle">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        placeholder='Write your comment title here...'
                                        value={newComment.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="commentContent">
                                    <Form.Label>Content</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        placeholder='Write your comment here...'
                                        rows={3}
                                        name="content"
                                        value={newComment.content}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="commentImageUrls">
                                    <Form.Label>Image URLs (comma separated)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="https://www..."
                                        name="image_urls"
                                        value={newComment.image_urls}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Button variant="light" type="submit" className={discussionClasses.add_comment_btn} >
                                    Submit
                                </Button>
                            </Form>
                        </div>
                    </Collapse>
                    <Collapse in={open}>
                        <div id="comments-collapse" className={discussionClasses.comments}>
                            {comments.map(comment => (
                                <Comment key={comment.id} comment={comment} />
                            ))}
                        </div>
                    </Collapse>
                    {open && (
                        <div className={discussionClasses.discussion_btn_group}>
                            <span className={discussionClasses.toggleIcon}>
                                <Image
                                    onClick={() => setOpen(!open)}
                                    aria-controls="comments-collapse"
                                    aria-expanded={open}
                                    src={getIconPath('icon-up-big')}
                                    alt="Arrow icon"
                                    width={16}
                                    height={16}
                                /></span>
                        </div>
                    )}
                </div>
            </article>
        </main>
    );
};

export default Discussion;