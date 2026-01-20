import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shoppage/shoppage.component';
import CheckoutPage from './pages/checkout/checkout.component';
import ContactPage from './pages/contact/contact.component';
import ProductDetailPage from './pages/product-detail/product-detail.component';
import WeddingSareesPage from './pages/wedding-sarees/wedding-sarees.component';
import PartyWearsPage from './pages/party-wears/party-wears.component';
import CeremoniesPage from './pages/ceremonies/ceremonies.component';

import Banner from './components/banner/banner.component';
import Header from './components/header/header.component';
import SearchBar from './components/search-bar/search-bar.component';
import Carousel from './components/carousel/carousel.component';
import Footer from './components/footer/footer.component';
import SignInSignUpPage from './pages/sign-in-sign-up-page/sign-in-sign-up.component';
import './App.css';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user/user.actions';


class App extends React.Component {

  unsubscribeFromAuth = null;

  componentDidMount() {

    const { setCurrentUser } = this.props;

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot(snapshot => {
          setCurrentUser({
            id: snapshot.id,
            ...snapshot.data()
          })
        })
      }
      this.setState({ currentUser: userAuth })
    })
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    const { location } = this.props;
    const hideSearchBar = location.pathname === '/checkout';
    const showCarousel = location.pathname === '/';
    
    return (
      <div className="min-h-screen" style={{backgroundColor: '#FEF8F1'}}>
        <Banner />
        <Header />
        {!hideSearchBar && <SearchBar />}
        {showCarousel && <Carousel />}
        <main className="mx-auto px-4 sm:px-6 lg:px-8">
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route path='/shop' component={ShopPage} />
            <Route exact path='/shop/wedding-sarees' component={WeddingSareesPage} />
            <Route exact path='/shop/party-wears' component={PartyWearsPage} />
            <Route exact path='/shop/ceremonies' component={CeremoniesPage} />
            <Route exact path='/product/:id' component={ProductDetailPage} />
            <Route exact path='/contact' component={ContactPage} />
            <Route exact path='/checkout' component={CheckoutPage} />
            <Route exact path='/signin'
              render={() => this.props.currentUser ?
                (<Redirect to='/' />)
                :
                <SignInSignUpPage />} />
          </Switch>
        </main>
        <Footer />
      </div>
    )
  };
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
