import React from 'react';
import {withRouter} from 'react-router-dom';
import './menu-item.styles.scss';


const MenuItem = ({ title, imageUrl, size, history, linkUrl, match }) => (
    <div 
        className={`${size === 'large' ? 'md:col-span-2' : ''} relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden cursor-pointer group transform transition-transform hover:scale-105 shadow-lg`} 
        onClick={() => history.push(`${match.url}${linkUrl}`)}
    >
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform group-hover:scale-110" 
            style={{
                backgroundImage: `url(${imageUrl})`
            }} 
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">{title.toUpperCase()}</h1>
            <span className="text-sm md:text-base font-medium border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition-colors">SHOP NOW</span>
        </div>
    </div>
);

export default withRouter(MenuItem);