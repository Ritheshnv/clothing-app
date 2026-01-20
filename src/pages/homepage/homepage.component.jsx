import React from 'react';
import './homepage.styles.scss';
import Directory from '../../components/directory/directory.component';
import SearchBar from '../../components/search-bar/search-bar.component';
import TrendingSection from '../../components/trending-section/trending-section.component';

const HomePage = () => (
    <div className="py-8">
        <SearchBar />
        <TrendingSection />
        <Directory />
    </div>
)

export default HomePage;