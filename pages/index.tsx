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
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';

        const res = await fetch(`${baseUrl}/api/data`);
        const data = await res.json();

        return {
            props: {
                initialDiscussions: [data.discussion],
                initialComments: data.comments,
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
