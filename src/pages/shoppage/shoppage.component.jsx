import React, { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCollectionsStartAsync } from '../../redux/shop/shop.actions';
import { selectIsCollectionFetching, selectIsCollectionsLoaded } from '../../redux/shop/shop.selectors';
import { createStructuredSelector } from 'reselect';

import CollectionsOverview from '../../components/collections-overview/collections-overview.component';
import CollectionPage from '../collection/collection.component';
import SearchResults from '../../components/search-results/search-results.component';

const ShopPage = ({ match, fetchCollectionsStartAsync, isCollectionsLoaded }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    if (!isCollectionsLoaded) {
      fetchCollectionsStartAsync();
    }
  }, [fetchCollectionsStartAsync, isCollectionsLoaded]);

  if (searchQuery) {
    return (
      <div className='shop-page'>
        <SearchResults searchQuery={searchQuery} />
      </div>
    );
  }

  return(
    <div className='shop-page'>
      <Route exact path={`${match.path}`} component={CollectionsOverview} />
      <Route path={`${match.path}/:collectionId`} component={CollectionPage} />
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  isCollectionsLoaded: selectIsCollectionsLoaded
});

const mapDispatchToProps = dispatch => ({
  fetchCollectionsStartAsync: () => dispatch(fetchCollectionsStartAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopPage);