import React, { useState, useEffect } from 'react';
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
import AddDiscussion from './AddDiscussion';
import { useAddDiscussion } from '../context/AddDiscussionContext';

interface DiscussionProps {
    discussions: DiscussionType[];
    initialComments: CommentType[];
    onAddDiscussion: (newDiscussion: DiscussionType) => void;
    selectedCategory: string | null;
}

const Discussion: React.FC<DiscussionProps> = ({ discussions, initialComments, onAddDiscussion, selectedCategory }) => {
    const [commentsByDiscussion, setCommentsByDiscussion] = useState<Map<number, CommentType[]>>(new Map());
    const [openComments, setOpenComments] = useState<number | null>(null);
    const [showAddComment, setShowAddComment] = useState<boolean[]>(discussions.map(() => false));
    const [newComment, setNewComment] = useState({ title: '', content: '', image_urls: '' });
    const [validationError, setValidationError] = useState<string | null>(null);
    const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
    const [commentCounts, setCommentCounts] = useState<number[]>([]);
    const [upvoted, setUpvoted] = useState<boolean[]>(discussions.map(() => false));
    const { addDiscussionView, toggleAddDiscussionView } = useAddDiscussion();

    useEffect(() => {
        const initialCommentCounts = discussions.map(discussion => {
            const commentsForDiscussion = initialComments.filter(comment => comment.discussionId === discussion.id);
            return commentsForDiscussion.length;
        });
        setCommentCounts(initialCommentCounts);

        const commentsMap = new Map<number, CommentType[]>();
        initialComments.forEach(comment => {
            const commentsForDiscussion = commentsMap.get(comment.discussionId) || [];
            commentsForDiscussion.push(comment);
            commentsMap.set(comment.discussionId, commentsForDiscussion);
        });
        setCommentsByDiscussion(commentsMap);
    }, [initialComments, discussions]);

    const handleBookmarkClick = (discussionId: number) => {
        if (bookmarks.includes(discussionId)) {
            removeBookmark(discussionId);
        } else {
            addBookmark(discussionId);
        }
    };

    const handleAddCommentClick = (index: number) => {
        setShowAddComment(prevShowAddComment => {
            const newState = [...prevShowAddComment];
            newState[index] = !newState[index];
            if (newState[index]) {
                setNewComment({ title: '', content: '', image_urls: '' });
            }
            return newState;
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewComment(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFormSubmit = (discussionId: number, index: number) => (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.title || !newComment.content) {
            setValidationError('Title and Content are required fields.');
            return;
        }

        const newCommentData: CommentType = {
            id: commentsByDiscussion.size + 1,
            discussionId,
            content: newComment.content,
            image_urls: newComment.image_urls.split(',').map(url => url.trim()).filter(url => url),
            viewCount: 0,
            upvoteCount: 0,
            commentCount: 0,
            category: discussions[index].category,
            user: {
                id: 44,
                image_url: 'https://picky-app.s3-ap-southeast-1.amazonaws.com/users/44444.202141131010.jpg',
                nick_name: 'Squad Current User',
                skin_type: 'Smooth'
            },
            createdAt: new Date().toISOString(),
            replies: []
        };

        setCommentsByDiscussion(prevMap => {
            const updatedMap = new Map(prevMap);
            const updatedComments = updatedMap.get(discussionId) || [];
            updatedComments.push(newCommentData);
            updatedMap.set(discussionId, updatedComments);
            return updatedMap;
        });

        setCommentCounts(prevCounts => {
            const newCounts = [...prevCounts];
            newCounts[index] += 1;
            return newCounts;
        });

        setNewComment({ title: '', content: '', image_urls: '' });
        setShowAddComment(prevShowAddComment => {
            const newState = [...prevShowAddComment];
            newState[index] = false;
            return newState;
        });
        setValidationError(null);
    };

    const handleUpvoteClick = (index: number) => {
        setUpvoted(prevUpvoted => {
            const newState = [...prevUpvoted];
            newState[index] = !newState[index];
            return newState;
        });

        discussions[index].upvoteCount += upvoted[index] ? -1 : 1;
    };

    const filteredDiscussions = selectedCategory
        ? discussions.filter(discussion => discussion.category.label === selectedCategory)
        : discussions;

    return (
        <main>
            <Button
                variant="light"
                className={`${discussionClasses.comment_btn} mb-2`}
                onClick={toggleAddDiscussionView}>{addDiscussionView ? "Cancel" : "Create a new discussion"} </Button>
            {addDiscussionView ? (
                <AddDiscussion
                    onAddDiscussion={onAddDiscussion}
                    discussionsLength={discussions.length}
                />
            ) : (
                filteredDiscussions.map((discussion, index) => (
                    <article key={discussion.id} className={discussionClasses.discussion_item}>
                        <div className={discussionClasses.discussion_row}>
                            <span className={discussionClasses.category}>{discussion.category.label}</span>
                            <span className={discussionClasses.desc}>{discussion.viewCount} views</span>
                            <Button
                                variant="light"
                                className={`${discussionClasses.favorite_btn} ${bookmarks.includes(discussion.id) ? discussionClasses.bookmarked : ''}`}
                                onClick={() => handleBookmarkClick(discussion.id)}
                            >
                                <Image
                                    src={getIconPath('icon-bookmark')}
                                    alt="Favorite icon"
                                    width={16}
                                    height={16}
                                />
                            </Button>
                        </div>
                        <div className={discussionClasses.discussion_user}>
                            <Avatar
                                className={discussionClasses.avatar_img}
                                sx={{ width: 65, height: 65 }}
                                src={discussion.user.image_url}
                            />
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
                                    variant="light" className={discussionClasses.upvotes} onClick={() => handleUpvoteClick(index)}>
                                    <Image
                                        src={getIconPath('icon-upvote')}
                                        alt="Upvote icon"
                                        width={16}
                                        height={16}
                                    />{discussion.upvoteCount} upvotes</Button>
                                <Button
                                    variant="light"
                                    className={discussionClasses.comment_btn}
                                    onClick={() => setOpenComments(openComments === index ? null : index)}
                                    aria-controls={`comments-collapse-${index}`}
                                    aria-expanded={openComments === index}>
                                    <Image
                                        src={getIconPath(openComments === index ? 'icon-up-big' : 'icon-down-big')}
                                        alt="Arrow icon"
                                        width={16}
                                        height={16}
                                    />View comments ({commentCounts[index] || 0})</Button>
                                <Button
                                    variant="light"
                                    className={discussionClasses.comment_btn}
                                    onClick={() => handleAddCommentClick(index)}>{showAddComment[index] ? "Cancel comment" : "Add comment"}</Button>
                            </div>
                            <Collapse in={showAddComment[index]}>
                                <div id={`add-comment-collapse-${index}`} className={discussionClasses.add_comment}>
                                    <Form onSubmit={handleFormSubmit(discussion.id, index)}>
                                        {validationError && <Alert variant="danger">{validationError}</Alert>}
                                        <Form.Group controlId={`commentTitle-${index}`}>
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
                                        <Form.Group controlId={`commentContent-${index}`}>
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
                                        <Form.Group controlId={`commentImageUrls-${index}`}>
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
                            <Collapse in={openComments === index}>
                                <div id={`comments-collapse-${index}`} className={discussionClasses.comments}>
                                    {(commentsByDiscussion.get(discussion.id) || []).map(comment => (
                                        <Comment key={comment.id} comment={comment} />
                                    ))}
                                </div>
                            </Collapse>
                            {openComments === index && (
                                <div className={discussionClasses.discussion_btn_group}>
                                    <span className={discussionClasses.toggleIcon}>
                                        <Image
                                            onClick={() => setOpenComments(null)}
                                            aria-controls={`comments-collapse-${index}`}
                                            aria-expanded={openComments === index}
                                            src={getIconPath('icon-up-big')}
                                            alt="Arrow icon"
                                            width={16}
                                            height={16}
                                        /></span>
                                </div>
                            )}
                        </div>
                    </article>
                ))
            )}
        </main>
    );
};

export default Discussion;
