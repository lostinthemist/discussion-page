import React from 'react';
import { Discussion as DiscussionType } from '../types';
import sidePanelClasses from './Sidepanel.module.css';
import { Button } from 'react-bootstrap';

interface SidePanelProps {
    discussions: DiscussionType[];
    selectedCategory: string | null;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const SidePanel: React.FC<SidePanelProps> = ({ discussions, selectedCategory, setSelectedCategory }) => {
    const renderCategories = () => {
        const categories = discussions.map((discussion) => discussion.category.label);
        const uniqueCategories = Array.from(new Set(categories));

        return (
            <>
                {uniqueCategories.length > 1 && (
                    <li key="all-categories">
                        <Button
                            className={`${sidePanelClasses.btn_link} ${!selectedCategory ? 'active' : ''}`}
                            variant="link"
                            onClick={() => setSelectedCategory(null)}
                        >
                            All Categories
                        </Button>
                    </li>
                )}
                {uniqueCategories.map((category) => (
                    <li key={category}>
                        <Button
                            className={`${sidePanelClasses.btn_link} ${selectedCategory === category ? sidePanelClasses.active : ''}`}
                            variant="link"
                            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                        >
                            {category}
                        </Button>
                    </li>
                ))}
            </>
        );
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
