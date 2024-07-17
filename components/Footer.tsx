import React from 'react';
import Container from 'react-bootstrap/Container';
import layoutClasses from './Layout.module.css';

const Footer: React.FC = () => {

    return (
        <footer className={layoutClasses.footer}>
            <Container>
                <p>&copy; 2024 Template footer | Rauno Kaldmaa</p>
            </Container>
        </footer>
    )
};

export default Footer;