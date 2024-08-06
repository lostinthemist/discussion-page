import { NextApiRequest, NextApiResponse } from 'next';
import discussionData from '../../data/discussion.json';
import commentsData from '../../data/comments.json';
import { Discussion, Comment } from '../../types';

interface DataResponse {
  discussion: Discussion;
  comments: Comment[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse<DataResponse>) {
  res.status(200).json({
    discussion: discussionData as Discussion,
    comments: commentsData as Comment[], 
  });
}
