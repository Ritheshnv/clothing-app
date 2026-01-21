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

    const shareOnWhatsApp = () => {
        const productUrl = window.location.href;
        const message = `Check out this amazing product: ${product.name}\n\nPrice: ₹${product.price}\n\n${product.description}\n\nView here: ${productUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
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

                    <div className='flex space-x-4'>
                        <CustomButton onClick={() => addItem(product)}>
                            Add to Cart
                        </CustomButton>
                        <button
                            onClick={shareOnWhatsApp}
                            className='flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded transition-colors'
                        >
                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488'/>
                            </svg>
                            <span>Share on WhatsApp</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    addItem: item => dispatch(addItem(item))
});

export default connect(null, mapDispatchToProps)(ProductDetailPage);