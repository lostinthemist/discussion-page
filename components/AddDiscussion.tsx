import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { Discussion as DiscussionType, Category } from '../types';
import discussionClasses from './Discussion.module.css';
import { Chip } from '@mui/material';
import { useAddDiscussion } from '../context/AddDiscussionContext';

interface AddDiscussionProps {
    onAddDiscussion: (newDiscussion: DiscussionType) => void;
    discussionsLength: number;
}

const categoriesList: Category[] = [
    { id: 1, label: 'Skin Concern' },
    { id: 2, label: 'Product Review' },
    { id: 3, label: 'Routine Help' },
    { id: 4, label: 'Makeup Help' },
    { id: 5, label: 'Product Info' },
    { id: 6, label: 'Brand Talk' },
    { id: 7, label: 'Rewards & Events' },
    { id: 8, label: 'Other' },
];

const AddDiscussion: React.FC<AddDiscussionProps> = ({ onAddDiscussion, discussionsLength }) => {
    const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', image_urls: '' });
    const [validationError, setValidationError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const { closeAddDiscussionView } = useAddDiscussion();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewDiscussion(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newDiscussion.title || !newDiscussion.content) {
            setValidationError('Title and Content are required fields.');
            return;
        }

        if (!selectedCategory) {
            setValidationError('Please select a category.');
            return;
        }

        const newDiscussionData: DiscussionType = {
            id: discussionsLength + 1,
            title: newDiscussion.title,
            content: newDiscussion.content,
            image_urls: newDiscussion.image_urls.split(',').map(url => url.trim()).filter(url => url),
            viewCount: 0,
            upvoteCount: 0,
            commentCount: 0,
            category: selectedCategory, 
            user: {
                id: 44,
                image_url: 'https://picky-app.s3-ap-southeast-1.amazonaws.com/users/44444.202141131010.jpg',
                nick_name: 'Squad Current User',
                skin_type: 'Smooth'
            },
            createdAt: new Date().toISOString(),
            comments: [] 
        };

        onAddDiscussion(newDiscussionData);  
        closeAddDiscussionView();

        setNewDiscussion({ title: '', content: '', image_urls: '' });
        setValidationError(null);
        setSelectedCategory(null);
    };

    return (
        <div className={discussionClasses.discussion_item}>
            <p>Create a new discussion below</p>
            <Form onSubmit={handleFormSubmit}>
                {validationError && <Alert variant="danger">{validationError}</Alert>}
                <Form.Group controlId="discussionTitle" className='mb-3'>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        placeholder="Write your discussion title here..."
                        value={newDiscussion.title}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="discussionContent" className='mb-3'>
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        name="content"
                        placeholder="Write your discussion content here..."
                        value={newDiscussion.content}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="discussionCategory" className='mb-3'>
                    <Form.Label>Category</Form.Label>
                    <div className="mb-3">
                        {categoriesList.map((category) => (
                            <Chip
                                key={category.id}
                                label={category.label}
                                clickable
                                color={selectedCategory?.id === category.id ? 'primary' : 'default'}
                                onClick={() => handleCategorySelect(category)}
                                style={{ marginRight: '5px', marginBottom: '5px' }}
                            />
                        ))}
                    </div>
                </Form.Group>
                <Form.Group controlId="discussionImageUrls" className='mb-3'>
                    <Form.Label>Image URLs (comma separated)</Form.Label>
                    <Form.Control
                        type="text"
                        name="image_urls"
                        placeholder="https://www..."
                        value={newDiscussion.image_urls}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default AddDiscussion;
