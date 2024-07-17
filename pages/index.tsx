import axios from 'axios';
import Discussion from '../components/Discussion';
import { GetServerSideProps } from 'next';
import { Discussion as DiscussionType, Comment as CommentType } from '../types';
import SidePanel from '@/components/Sidepanel';

interface HomeProps {
    discussion: DiscussionType;
    comments: CommentType[];
}

const Home: React.FC<HomeProps> = ({ discussion, comments }) => {
    return (
        <div className='container-fluid container-lg'>
            <h1 className='mt-3 mb-lg-3 mb-lg-5'>Discussion page</h1>
            <section className='d-flex flex-column flex-lg-row'>
                <SidePanel discussion={discussion} />
                <Discussion discussion={discussion} initialComments={comments} />
            </section>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    const res = await axios.get('http://localhost:3000/api/data');
    const data = res.data;

    return {
        props: {
            discussion: data.discussion,
            comments: data.comments,
        },
    };
};

export default Home;
