import React from 'react';
import { Discussion as DiscussionType } from '../types';
import sidePanelClasses from './Sidepanel.module.css';
import { Button } from 'react-bootstrap';

interface DiscussionProps {
    discussion: DiscussionType;
}

const SidePanel: React.FC<DiscussionProps> = ({ discussion }) => {
    const renderCategories = () => {
        const categories: string[] = Array.from([discussion]).map((discussion: any) => discussion.category.label);
        const uniqueCategories = Array.from(new Set(categories));
        return uniqueCategories.map((category, index) => (
            <li key={index}>
                <Button className={sidePanelClasses.btn_link} variant="link">{category}</Button>
            </li>
        ));
    };

    return (
        <aside className={sidePanelClasses.sidepanel}>
            <h5>Categories</h5>
            <ul className={sidePanelClasses.sidepanel_ul}>
                {renderCategories()}
            </ul>
        </aside>
    );
};

export default SidePanel;
