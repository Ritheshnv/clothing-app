import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCollectionsForPreview } from '../../redux/shop/shop.selectors';

const AllProducts = ({ collections }) => {
    const [allProducts, setAllProducts] = useState([]);
    
    useEffect(() => {
        if (collections && collections.length > 0) {
            const products = [];
            collections.forEach(collection => {
                if (collection.items) {
                    collection.items.forEach(item => {
                        products.push({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.imageUrl,
                            category: collection.routeName
                        });
                    });
                }
            });
            setAllProducts(products);
        }
    }, [collections]);

    if (!allProducts.length) {
        return null;
    }

    return (
        <div className='py-8 px-4'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {allProducts.map((item) => (
                    <Link 
                        key={item.id} 
                        to={`/product/${item.id}`}
                        className='cursor-pointer'
                    >
                        <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
                            <img 
                                src={item.image}
                                alt={item.name}
                                className='h-48 w-full object-cover'
                            />
                            <div className='p-4'>
                                <h3 className='font-medium text-sm mb-2 truncate'>{item.name}</h3>
                                <p className='text-lg font-bold'>₹{item.price}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    collections: selectCollectionsForPreview
});

export default connect(mapStateToProps)(AllProducts);
