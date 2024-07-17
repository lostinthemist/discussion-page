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
    map(arg0: (discussion: any) => any): unknown;
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
}

export interface Comment {
    id: number;
    content: string;
    image_urls: string[];
    viewCount: number;
    upvoteCount: number;
    commentCount: number;
    category: Category;
    user: User;
    createdAt: string;
    replies?: Comment[];
}
