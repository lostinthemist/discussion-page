import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AddDiscussionContextType {
    addDiscussionView: boolean;
    toggleAddDiscussionView: () => void;
    closeAddDiscussionView: () => void;
}

const AddDiscussionContext = createContext<AddDiscussionContextType | undefined>(undefined);

export const AddDiscussionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [addDiscussionView, setAddDiscussionView] = useState<boolean>(false);

    const toggleAddDiscussionView = () => {
        setAddDiscussionView(prevState => !prevState);
    };

    const closeAddDiscussionView = () => {
        setAddDiscussionView(false);
    };

    return (
        <AddDiscussionContext.Provider value={{ addDiscussionView, toggleAddDiscussionView, closeAddDiscussionView }}>
            {children}
        </AddDiscussionContext.Provider>
    );
};

export const useAddDiscussion = (): AddDiscussionContextType => {
    const context = useContext(AddDiscussionContext);
    if (!context) {
        throw new Error('useAddDiscussion must be used within an AddDiscussionProvider');
    }
    return context;
};
