import Discussion from '../components/Discussion';
import { GetServerSideProps } from 'next';
import { Discussion as DiscussionType, Comment as CommentType } from '../types';
import SidePanel from '@/components/Sidepanel';
import React, { useState, useEffect } from 'react';

interface HomeProps {
    initialDiscussions: DiscussionType[];
    initialComments: CommentType[];
}

const Home: React.FC<HomeProps> = ({ initialDiscussions, initialComments }) => {
    const [discussions, setDiscussions] = useState<DiscussionType[]>(initialDiscussions);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:3000/api/data');
            const data = await res.json();

            setDiscussions([data.discussion]);
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const handleAddDiscussion = (newDiscussion: DiscussionType) => {
        setDiscussions(prevDiscussions => [...prevDiscussions, newDiscussion]);
    };

    if (isLoading) {
        return <div>Data loading...</div>;
    }

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
    const res = await fetch('http://localhost:3000/api/data');
    const data = await res.json();

    return {
        props: {
            initialDiscussions: [data.discussion],
            initialComments: data.comments,
        },
    };
};

export default Home;
