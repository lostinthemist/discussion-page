import React, { useState } from 'react';
import { register } from 'swiper/element/bundle';
import Image from 'next/image';
import { Button, Modal } from 'react-bootstrap';
import galleryStyles from './Gallery.module.css';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { getIconPath } from '@/utils/iconUtils';

register();

interface ImageGalleryProps {
    imageUrls: string[];
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'swiper-container': any;
            'swiper-slide': any;
        }
    }
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ imageUrls }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (url: string) => {
        setSelectedImage(url);
        setShowModal(true);
    };

    return (<>
        <Swiper
            spaceBetween={10}
            pagination={{
                clickable: true,
            }}
            slidesPerView={1.5}
            breakpoints={{
                576: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 2.5,
                },
                1024: {
                    slidesPerView: 3,
                },
            }}
            className={galleryStyles.gallery_swiper}>
            {imageUrls.map((url, index) => (
                <SwiperSlide key={url}>
                    <div className={galleryStyles.galleryItem} onClick={() => handleImageClick(url)}>
                        <Image src={url} alt={`Gallery image ${index + 1}`} fill={true} style={{objectFit: "contain"}} />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Body>
                {selectedImage && (
                    <>
                        <Button
                            variant="light"
                            className={galleryStyles.close_btn}
                            onClick={() => setShowModal(false)}
                            >
                            <Image
                                src={getIconPath('icon-close')}
                                alt="Close icon"
                                width={16}
                                height={16}
                            /></Button>
                        <Image className={galleryStyles.gallery_img} src={selectedImage} alt="Gallery image" layout="responsive" width={700} height={475} />
                    </>
                )}
            </Modal.Body>
        </Modal>
    </>
    );
};

export default ImageGallery;