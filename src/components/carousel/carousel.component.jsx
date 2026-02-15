import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';
import { selectCollectionsForPreview, selectIsCollectionFetching } from '../../redux/shop/shop.selectors';

const Carousel = ({ collections, isLoading }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const history = useHistory();

  useEffect(() => {
    console.log('Carousel collections:', collections);
    console.log('Carousel isLoading:', isLoading);
    
    if (collections && collections.length > 0) {
      const carouselSlides = collections.map(collection => {
        const firstItem = collection.items && collection.items[0];
        return {
          title: collection.title,
          image: firstItem ? firstItem.imageUrl : 'https://dihana-couture.s3.us-east-1.amazonaws.com/placeholder.jpg',
          link: `/shop/${collection.routeName}`
        };
      }).slice(0, 4);
      console.log('Generated slides:', carouselSlides);
      setSlides(carouselSlides);
    } else if (!isLoading && (!collections || collections.length === 0)) {
      // Fallback slides when no data is available
      setSlides([
        {
          title: "Cotton Collection",
          description: "Breathable comfort meets timeless elegance. Perfect for everyday grace.",
          image: "https://d3jifdeyjpus7e.cloudfront.net/sarees/cotton/cotton-2/main.jpg",
          link: "/shop/cotton"
        },
        {
          title: "Silk Collection", 
          description: "Luxurious silk sarees that embody tradition and sophistication.",
          image: "https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-4/main.jpg",
          link: "/shop/silk"
        }
      ]);
    }
  }, [collections, isLoading]);

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  if (isLoading) {
    return (
      <div className='py-8'>
        <div className='w-full bg-gray-200 h-80 md:h-96 flex items-center justify-center'>
          <p className='text-gray-500'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className='py-8'>
        <div className='w-full bg-gray-200 h-80 md:h-96 flex items-center justify-center'>
          <p className='text-gray-500'>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className='py-8'>
      <div className='w-full bg-white shadow-sm overflow-hidden'>
        <div className='relative h-80 md:h-96 cursor-pointer' onClick={() => history.push(slides[currentSlide].link)}>
          <img 
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].title}
            className='w-full h-full object-cover'
            onError={(e) => {
              console.error('Image failed to load:', e.target.src);
              e.target.src = 'https://via.placeholder.com/800x400/cccccc/666666?text=Image+Not+Available';
            }}
          />
          <div className='absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center px-4'>
            <h2 className='text-white text-3xl md:text-5xl font-bold text-center mb-3' style={{fontFamily: 'Georgia, serif'}}>
              {slides[currentSlide].title}
            </h2>
            {slides[currentSlide].description && (
              <p className='text-white text-sm md:text-lg text-center max-w-2xl' style={{fontFamily: 'Playfair Display, serif', fontStyle: 'italic'}}>
                {slides[currentSlide].description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  collections: selectCollectionsForPreview,
  isLoading: selectIsCollectionFetching
});

export default connect(mapStateToProps)(Carousel);