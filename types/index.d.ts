export interface User {
    id: number;
    image_url: string;
    nick_name: string;
    skin_type: string;
}

export interface Category {
    id: number;
    label: string;
}

export interface Discussion {
    id: number;
    title: string;
    content: string;
    image_urls: string[];
    viewCount: number;
    upvoteCount: number;
    commentCount: number;
    category: Category;
    user: User;
    createdAt: string;
    comments: Comment[]; 
    discussionId?: number;
}

export interface Comment {
    id: number;
    discussionId: number;
    content: string;
    image_urls: string[];
    viewCount: number;
    upvoteCount: number;
    commentCount: number;
    category: Category;
    user: User;
    createdAt: string;
    replies: Reply[];
}
