import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs'; // Use fs/promises for asynchronous file reading
import path from 'path';
import { Discussion, Comment } from '../../types';

interface DataResponse {
  discussion: Discussion | null;
  comments: Comment[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DataResponse>) {
  try {
    // Construct the file paths
    const discussionFilePath = path.join(process.cwd(), 'public', 'data', 'discussion.json');
    const commentsFilePath = path.join(process.cwd(), 'public', 'data', 'comments.json');

    // Read and parse the discussion data
    const discussionFileContents = await fs.readFile(discussionFilePath, 'utf8');
    const discussionData: Discussion = JSON.parse(discussionFileContents);

    // Read and parse the comments data
    const commentsFileContents = await fs.readFile(commentsFilePath, 'utf8');
    const commentsData: Comment[] = JSON.parse(commentsFileContents);

    // Respond with the data
    res.status(200).json({
      discussion: discussionData,
      comments: commentsData,
    });
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ discussion: null, comments: [] });
  }
}
