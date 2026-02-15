import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Stories = ({ collections }) => {
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);
  const [progress, setProgress] = useState(0);
  const history = useHistory();

  useEffect(() => {
    if (collections && collections.length > 0) {
      const storyData = collections.map(collection => {
        const firstItem = collection.items && collection.items[0];
        return {
          id: collection.id,
          title: collection.title,
          image: firstItem ? firstItem.imageUrl : 'https://dihana-couture.s3.us-east-1.amazonaws.com/placeholder.jpg',
          link: `/shop/${collection.routeName}`
        };
      }).slice(0, 6);
      setStories(storyData);
    } else {
      setStories([
        {
          id: 1,
          title: "Cotton",
          description: "Breathable comfort meets timeless elegance. Perfect for everyday grace.",
          image: "https://d3jifdeyjpus7e.cloudfront.net/sarees/cotton/cotton-2/main.jpg",
          link: "/shop/cotton"
        },
        {
          id: 2,
          title: "Silk",
          description: "Luxurious silk sarees that embody tradition and sophistication.",
          image: "https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-4/main.jpg",
          link: "/shop/silk"
        }
      ]);
    }
  }, [collections]);

  useEffect(() => {
    if (activeStory !== null) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleClose();
            return 0;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [activeStory]);

  const handleStoryClick = (index) => {
    setActiveStory(index);
    setProgress(0);
  };

  const handleClose = () => {
    setActiveStory(null);
    setProgress(0);
  };

  const handleNavigate = () => {
    if (activeStory !== null) {
      history.push(stories[activeStory].link);
      handleClose();
    }
  };

  if (!stories.length) return null;

  return (
    <>
      {/* Stories Circles - Only visible on mobile */}
      <div className='md:hidden bg-white py-3 px-2 overflow-x-auto'>
        <div className='flex space-x-3'>
          {stories.map((story, index) => (
            <div
              key={story.id}
              onClick={() => handleStoryClick(index)}
              className='flex flex-col items-center flex-shrink-0 cursor-pointer'
            >
              <div className='w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500'>
                <div className='w-full h-full rounded-full border-2 border-white overflow-hidden'>
                  <img
                    src={story.image}
                    alt={story.title}
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>
              <span className='text-xs mt-1 text-gray-700 truncate w-16 text-center'>
                {story.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Story View */}
      {activeStory !== null && (
        <div className='fixed inset-0 bg-black z-50 flex flex-col'>
          {/* Progress Bar */}
          <div className='absolute top-0 left-0 right-0 h-1 bg-gray-700 z-10'>
            <div
              className='h-full bg-white transition-all duration-100'
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Header */}
          <div className='absolute top-4 left-0 right-0 flex items-center justify-between px-4 z-10'>
            <div className='flex items-center space-x-3'>
              <button onClick={handleClose} className='text-white'>
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
              </button>
              <span className='text-white font-semibold'>{stories[activeStory].title}</span>
            </div>
            <button onClick={handleClose} className='text-white'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {/* Story Image */}
          <div className='flex-1 flex items-center justify-center' onClick={handleNavigate}>
            <img
              src={stories[activeStory].image}
              alt={stories[activeStory].title}
              className='max-w-full max-h-full object-contain'
            />
          </div>

          {/* Shop Now Button */}
          <div className='absolute bottom-8 left-0 right-0 flex justify-center px-4'>
            <button
              onClick={handleNavigate}
              className='bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors'
            >
              Shop Now
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;
