import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectCollections } from '../../redux/shop/shop.selectors';

const Directory = ({ collections }) => {
  const [weddingIndex, setWeddingIndex] = useState(0);
  const [bestSellersIndex, setBestSellersIndex] = useState(0);
  const [trendingIndex, setTrendingIndex] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [weddingProducts, setWeddingProducts] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

  useEffect(() => {
    if (collections) {
      const allProducts = Object.values(collections).flatMap(col => col.items || []);
      console.log('All products:', allProducts);
      console.log('Products with tags:', allProducts.map(p => ({ id: p.id, name: p.name, tag: p.tag })));
      
      const trending = allProducts.filter(p => p.tag === 'trending').slice(0, 6);
      const wedding = allProducts.filter(p => p.tag === 'wedding').slice(0, 6);
      const bestseller = allProducts.filter(p => p.tag === 'bestseller').slice(0, 6);
      
      console.log('Trending:', trending.length);
      console.log('Wedding:', wedding.length);
      console.log('Bestseller:', bestseller.length);
      
      setTrendingProducts(trending.length > 0 ? trending : allProducts.slice(0, 6));
      setWeddingProducts(wedding.length > 0 ? wedding : allProducts.slice(0, 6));
      setBestSellerProducts(bestseller.length > 0 ? bestseller : allProducts.slice(0, 6));
    }
  }, [collections]);

  const categories = [
    { name: 'Silk Sarees', image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-1/main.jpg', link: '/shop/silk' },
    { name: 'Cotton Sarees', image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/cotton/cotton-1/main.jpg', link: '/shop/cotton' }
  ];

  const scrollTrending = (direction) => {
    const maxIndex = Math.max(0, trendingProducts.length - 3);
    if (direction === 'left') {
      setTrendingIndex(Math.max(0, trendingIndex - 1));
    } else {
      setTrendingIndex(Math.min(maxIndex, trendingIndex + 1));
    }
  };

  const scrollWedding = (direction) => {
    const maxIndex = Math.max(0, weddingProducts.length - 3);
    if (direction === 'left') {
      setWeddingIndex(Math.max(0, weddingIndex - 1));
    } else {
      setWeddingIndex(Math.min(maxIndex, weddingIndex + 1));
    }
  };

  const scrollBestSellers = (direction) => {
    const maxIndex = Math.max(0, bestSellerProducts.length - 3);
    if (direction === 'left') {
      setBestSellersIndex(Math.max(0, bestSellersIndex - 1));
    } else {
      setBestSellersIndex(Math.min(maxIndex, bestSellersIndex + 1));
    }
  };

  return (
    <div className="py-12 space-y-16">
      {/* Shop by Category */}
      {/* <section>
        <div className="mb-6 px-4">
          <h2 className="text-sm font-bold">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category, index) => (
            <Link key={index} to={category.link} className="group">
              <div className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section> */}

      {/* Trending Now */}
      {/* {trendingProducts.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6 px-4">
            <h2 className="text-sm font-bold">Trending Now</h2>
            <Link to="/shop?tag=trending" className="text-blue-600 hover:text-blue-800 font-medium text-xs">View All →</Link>
          </div>
          <div className="overflow-x-auto scrollbar-hide px-4" style={{ scrollBehavior: 'smooth' }}>
            <div className="flex space-x-4 pb-4">
              {trendingProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`} className="flex-shrink-0 w-64">
                  <div className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-80 object-cover" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm">₹{item.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* Wedding Selections */}
      {/* {weddingProducts.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6 px-4">
            <h2 className="text-sm font-bold">Wedding Selections</h2>
            <Link to="/shop?tag=wedding" className="text-blue-600 hover:text-blue-800 font-medium text-xs">View All →</Link>
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${weddingIndex * 33.333}%)` }}>
                {weddingProducts.map((item) => (
                  <div key={item.id} className="w-1/3 flex-shrink-0 px-1">
                    <Link to={`/product/${item.id}`}>
                      <div className="relative overflow-hidden shadow-lg">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-64 object-cover" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-sm">₹{item.price}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            {weddingProducts.length > 3 && (
              <>
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
              </>
            )}
          </div>
        </section>
      )} */}

      {/* Best Sellers */}
      {bestSellerProducts.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6 px-4">
            <h2 className="text-sm font-bold">Best Sellers</h2>
            <Link to="/shop?tag=bestseller" className="text-blue-600 hover:text-blue-800 font-medium text-xs">View All →</Link>
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${bestSellersIndex * 33.333}%)` }}>
                {bestSellerProducts.map((item) => (
                  <div key={item.id} className="w-1/3 flex-shrink-0 px-1">
                    <Link to={`/product/${item.id}`}>
                      <div className="relative overflow-hidden shadow-lg">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-64 object-cover" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-sm">₹{item.price}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            {bestSellerProducts.length > 3 && (
              <>
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
              </>
            )}
          </div>
        </section>
      )}

      {/* Shop by Price */}
      <section>
        <div className="mb-6 px-4">
          <h2 className="text-sm font-bold">Shop by Price</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Link to="/shop?price=0-2000" className="group">
            <div className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://d3jifdeyjpus7e.cloudfront.net/sarees/cotton/cotton-2/main.jpg" alt="Under ₹2,000" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all" />
              <div className="absolute bottom-2 left-2 text-white">
                <h3 className="text-sm font-semibold">Under ₹2,000</h3>
              </div>
            </div>
          </Link>
          <Link to="/shop?price=2000-5000" className="group">
            <div className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-2/main.jpg" alt="₹2,000 - ₹5,000" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all" />
              <div className="absolute bottom-2 left-2 text-white">
                <h3 className="text-sm font-semibold">₹2,000 - ₹5,000</h3>
              </div>
            </div>
          </Link>
          <Link to="/shop?price=5000-10000" className="group">
            <div className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-4/main.jpg" alt="₹5,000 - ₹10,000" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all" />
              <div className="absolute bottom-2 left-2 text-white">
                <h3 className="text-sm font-semibold">₹5,000 - ₹10,000</h3>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

const mapStateToProps = (state) => ({
  collections: selectCollections(state)
});

export default connect(mapStateToProps)(Directory);