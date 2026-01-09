import React from 'react';
import CollectionItem from '../collection-item/collection-item.component';

import './collection-preview.styles.scss';

const CollectionPreview = ({ title, items }) => (
    <div className='mb-12'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-6'>{title.toUpperCase()}</h1>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
            {
                items
                    .filter((item, index) => index < 4)
                    .map((item) => (
                        <CollectionItem key={item.id} item={item} />
                    ))
            }
        </div>
    </div>
)

export default CollectionPreview;