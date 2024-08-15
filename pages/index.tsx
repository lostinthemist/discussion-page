import Discussion from '../components/Discussion';
import { GetServerSideProps } from 'next';
import { Discussion as DiscussionType, Comment as CommentType } from '../types';
import SidePanel from '@/components/Sidepanel';
import React, { useState } from 'react';

interface HomeProps {
    initialDiscussions: DiscussionType[];
    initialComments: CommentType[];
}

const Home: React.FC<HomeProps> = ({ initialDiscussions, initialComments }) => {
    const [discussions, setDiscussions] = useState<DiscussionType[]>(initialDiscussions);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleAddDiscussion = (newDiscussion: DiscussionType) => {
        setDiscussions(prevDiscussions => [...prevDiscussions, newDiscussion]);
    };

    return (
        <div className='container-fluid container-lg'>
            <h1 className='mt-3 mb-lg-3 mb-lg-5'>Discussion page</h1>
            <section className='d-flex flex-column flex-lg-row'>
                <SidePanel
                    discussions={discussions}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />
                <Discussion
                    discussions={discussions}
                    initialComments={initialComments}
                    onAddDiscussion={handleAddDiscussion}
                    selectedCategory={selectedCategory}
                />
            </section>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const discussionRes = await fetch('https://discussion-page.vercel.app/data/discussion.json');
        const commentsRes = await fetch('https://discussion-page.vercel.app/data/comments.json');

        if (!discussionRes.ok || !commentsRes.ok) {
            throw new Error('Failed to fetch data');
        }

        const discussionData = await discussionRes.json();
        const commentsData = await commentsRes.json();

        return {
            props: {
                initialDiscussions: [discussionData],
                initialComments: commentsData,
            },
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                initialDiscussions: [],
                initialComments: [],
            },
        };
    }
};

export default Home;
