import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchCollectionsStartAsync } from '../../redux/shop/shop.actions';
import { selectIsCollectionsLoaded } from '../../redux/shop/shop.selectors';
import './homepage.styles.scss';
import Directory from '../../components/directory/directory.component';
import SearchBar from '../../components/search-bar/search-bar.component';
import AllProducts from '../../components/all-products/all-products.component';
import TrendingSection from '../../components/trending-section/trending-section.component';

const HomePage = ({ fetchCollectionsStartAsync, isCollectionsLoaded }) => {
  useEffect(() => {
    if (!isCollectionsLoaded) {
      fetchCollectionsStartAsync();
    }
  }, [fetchCollectionsStartAsync, isCollectionsLoaded]);

  return (
    <div className="py-8">
      <SearchBar />
      <AllProducts />
      {/* <TrendingSection /> */}
      <Directory />
    </div>
  );
};

const mapStateToProps = state => ({
  isCollectionsLoaded: selectIsCollectionsLoaded(state)
});

const mapDispatchToProps = dispatch => ({
  fetchCollectionsStartAsync: () => dispatch(fetchCollectionsStartAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);