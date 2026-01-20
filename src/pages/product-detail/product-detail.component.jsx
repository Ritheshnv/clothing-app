import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addItem } from '../../redux/cart/cart.actions';
import CustomButton from '../../components/custom-button/custom-button.component';

const ProductDetailPage = ({ match, addItem }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Mock product data - in real app, fetch by ID
    const product = {
        id: parseInt(match.params.id),
        name: 'Premium Fashion Item',
        price: 85,
        description: 'This is a premium quality fashion item made with the finest materials. Perfect for any occasion, combining style and comfort in one beautiful piece.',
        images: [
            'https://i.ibb.co/KV18Ysr/floral-skirt.png',
            'https://i.ibb.co/0s3pdnc/adidas-nmd.png',
            'https://i.ibb.co/XzcwL5s/black-shearling.png',
            'https://i.ibb.co/ZYW3VTp/brown-brim.png'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Navy', 'Gray']
    };

    return (
        <div className='max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Image Gallery */}
                <div>
                    <div className='mb-4'>
                        <img 
                            src={product.images[currentImageIndex]} 
                            alt={product.name}
                            className='w-full h-96 object-cover rounded-lg'
                        />
                    </div>
                    <div className='grid grid-cols-4 gap-2'>
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`${product.name} ${index + 1}`}
                                className={`h-20 object-cover rounded cursor-pointer ${
                                    index === currentImageIndex ? 'ring-2 ring-gray-900' : ''
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <h1 className='text-3xl font-bold text-gray-900 mb-4'>{product.name}</h1>
                    <p className='text-2xl font-bold text-gray-900 mb-6'>₹{product.price}</p>
                    
                    <div className='mb-6'>
                        <h3 className='text-lg font-medium mb-2'>Description</h3>
                        <p className='text-gray-600'>{product.description}</p>
                    </div>

                    <div className='mb-6'>
                        <h3 className='text-lg font-medium mb-2'>Size</h3>
                        <div className='flex space-x-2'>
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    className='px-4 py-2 border border-gray-300 rounded hover:border-gray-900'
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='mb-8'>
                        <h3 className='text-lg font-medium mb-2'>Color</h3>
                        <div className='flex space-x-2'>
                            {product.colors.map(color => (
                                <button
                                    key={color}
                                    className='px-4 py-2 border border-gray-300 rounded hover:border-gray-900'
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    <CustomButton onClick={() => addItem(product)}>
                        Add to Cart
                    </CustomButton>
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    addItem: item => dispatch(addItem(item))
});

export default connect(null, mapDispatchToProps)(ProductDetailPage);