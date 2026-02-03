import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Directory = () => {
  const [weddingIndex, setWeddingIndex] = useState(0);
  const [bestSellersIndex, setBestSellersIndex] = useState(0);

  // Placeholder data - will be replaced with backend data
  const categories = [
    { name: 'Silk Sarees', image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-1/main.jpg', link: '/shop/silk' },
    { name: 'Cotton Sarees', image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/cotton/cotton-1/main.jpg', link: '/shop/cotton' },
    { name: 'Party Wear', image: 'https://via.placeholder.com/300x400/f3f4f6/6b7280?text=Party+Wear', link: '/shop/party' }
  ];

  const weddingSelections = [
    { name: 'Bridal Silk', image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-4/main.jpg' },
    { name: 'Wedding Lehenga', image: 'https://via.placeholder.com/300x400/f3f4f6/6b7280?text=Wedding+Lehenga' },
    { name: 'Bridal Accessories', image: 'https://via.placeholder.com/300x400/f3f4f6/6b7280?text=Bridal+Accessories' },
    { name: 'Groom Wear', image: 'https://via.placeholder.com/300x400/f3f4f6/6b7280?text=Groom+Wear' }
  ];

  const priceRanges = [
    { range: 'Under ₹2,000', image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/cotton/cotton-2/main.jpg', link: '/shop?price=0-2000' },
    { range: '₹2,000 - ₹5,000', image: 'https://via.placeholder.com/300x400/f3f4f6/6b7280?text=2K-5K', link: '/shop?price=2000-5000' },
    { range: '₹5,000 - ₹10,000', image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-2/main.jpg', link: '/shop?price=5000-10000' }
  ];

  const bestSellers = [
    { name: 'Kanchi Silk', image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-4/main.jpg', price: '₹5,992' },
    { name: 'Cotton Elegance', image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/cotton/cotton-2/main.jpg', price: '₹2,392' },
    { name: 'Designer Collection', image: 'https://via.placeholder.com/300x400/f3f4f6/6b7280?text=Designer', price: '₹8,500' },
    { name: 'Premium Silk', image: 'https://via.placeholder.com/300x400/f3f4f6/6b7280?text=Premium', price: '₹12,000' }
  ];

  const scrollWedding = (direction) => {
    const maxIndex = weddingSelections.length - 3;
    if (direction === 'left') {
      setWeddingIndex(Math.max(0, weddingIndex - 1));
    } else {
      setWeddingIndex(Math.min(maxIndex, weddingIndex + 1));
    }
  };

  const scrollBestSellers = (direction) => {
    const maxIndex = bestSellers.length - 3;
    if (direction === 'left') {
      setBestSellersIndex(Math.max(0, bestSellersIndex - 1));
    } else {
      setBestSellersIndex(Math.min(maxIndex, bestSellersIndex + 1));
    }
  };

  return (
    <div className="py-12 space-y-16">
      {/* Shop by Category */}
      <section>
        <div className="text-center mb-8 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our exquisite collection of traditional and contemporary sarees, carefully curated for every occasion.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {categories.slice(0, 2).map((category, index) => (
            <Link key={index} to={category.link} className="group">
              <div className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img src={category.image} alt={category.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Wedding Selections */}
      <section>
        <div className="flex justify-between items-center mb-8 px-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Wedding Selections</h2>
            <p className="text-lg text-gray-600">Perfect ensembles for your special day, crafted with love and tradition.</p>
          </div>
          <Link to="/shop/wedding" className="text-blue-600 hover:text-blue-800 font-medium">View All →</Link>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${weddingIndex * 33.333}%)` }}>
              {weddingSelections.map((item, index) => (
                <div key={index} className="w-1/3 flex-shrink-0 px-1">
                  <div className="relative overflow-hidden shadow-lg">
                    <img src={item.image} alt={item.name} className="w-full h-64 object-cover" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => scrollWedding('left')} className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 shadow-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => scrollWedding('right')} className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 shadow-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Best Sellers */}
      <section>
        <div className="flex justify-between items-center mb-8 px-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Best Sellers</h2>
            <p className="text-lg text-gray-600">Our most loved sarees, chosen by customers for their exceptional quality and design.</p>
          </div>
          <Link to="/shop/bestsellers" className="text-blue-600 hover:text-blue-800 font-medium">View All →</Link>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${bestSellersIndex * 33.333}%)` }}>
              {bestSellers.map((item, index) => (
                <div key={index} className="w-1/3 flex-shrink-0 px-1">
                  <div className="relative overflow-hidden shadow-lg">
                    <img src={item.image} alt={item.name} className="w-full h-64 object-cover" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm">{item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => scrollBestSellers('left')} className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 shadow-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => scrollBestSellers('right')} className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 shadow-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Shop by Price */}
      <section>
        <div className="text-center mb-8 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Price</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Find the perfect saree within your budget, from affordable elegance to luxury collections.</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {priceRanges.map((range, index) => (
            <Link key={index} to={range.link} className="group">
              <div className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img src={range.image} alt={range.range} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all" />
                <div className="absolute bottom-2 left-2 text-white">
                  <h3 className="text-sm font-semibold">{range.range}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Directory;