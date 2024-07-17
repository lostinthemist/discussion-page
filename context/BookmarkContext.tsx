import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface BookmarkContextType {
  bookmarks: number[];
  addBookmark: (id: number) => void;
  removeBookmark: (id: number) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const addBookmark = (id: number) => {
    setBookmarks(prevBookmarks => [...prevBookmarks, id]);
  };

  const removeBookmark = (id: number) => {
    setBookmarks(prevBookmarks => prevBookmarks.filter(bookmarkId => bookmarkId !== id));
  };

  const value = useMemo(
    () => ({ bookmarks, addBookmark, removeBookmark }),
    [bookmarks]
  );

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
