import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavLink from 'react-bootstrap/NavLink';
import layoutClasses from './Layout.module.css';
import { getIconPath } from '../utils/iconUtils';
import Image from 'next/image';
import { useBookmarks } from '../context/BookmarkContext';

const Header: React.FC = () => {
	const { bookmarks } = useBookmarks();

	return (
		<Navbar collapseOnSelect expand="lg" sticky="top" className={layoutClasses.customNav}>
			<Container>
				<Navbar.Toggle aria-controls="layout-header-nav">
				</Navbar.Toggle>
				<Navbar.Collapse id="layout-header-nav">
					<Nav className="d-flex w-100 justify-content-around" >
						<Navbar.Brand>
							<Image
								src={getIconPath('icon-brand')}
								alt="Brand icon"
								width={24}
								height={24} />
						</Navbar.Brand>
						<NavLink>products</NavLink>
						<NavLink>curation</NavLink>
						<NavLink>discussion</NavLink>
						<NavLink>for creators</NavLink>
						<div className={layoutClasses.navbar_last}>
							<div className={layoutClasses.bookmark_area}>
								{bookmarks.length > 0 && <span className={layoutClasses.bookmarks}>{bookmarks.length}</span>}
							</div>
							<form className={layoutClasses.search_bar}>
								<input type="text" placeholder="Search.." name="search" />
								<button type="submit"><Image
									src={getIconPath('search')}
									alt="Search icon"
									width={24}
									height={24} />
								</button>
							</form>
						</div>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
};

export default Header;