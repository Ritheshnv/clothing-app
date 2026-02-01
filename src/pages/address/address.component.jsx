import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';
import { selectCartItems, selectCartTotal } from '../../redux/cart/cart.selectors';
import { clearCart } from '../../redux/cart/cart.actions';

const AddressPage = ({ cartItems, total, currentUser, clearCart }) => {
  const [addressData, setAddressData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please sign in to place an order');
      return;
    }

    setIsPlacingOrder(true);
    
    try {
      const orderData = {
        userId: currentUser.id,
        userEmail: currentUser.email,
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        shippingAddress: addressData
      };

      const response = await fetch('https://an4mjc3sya.execute-api.us-east-1.amazonaws.com/prod/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (response.ok) {
        clearCart();
        alert(`Order placed successfully! Order ID: ${result.orderId}`);
        history.push('/orders');
      } else {
        alert('Failed to place order: ' + result.error);
      }
    } catch (error) {
      alert('Error placing order: ' + error.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Please sign in to continue with your order.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Shipping Address</h1>
      
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-2 mt-2 font-semibold">
          Total: ₹{total}
        </div>
      </div>

      {/* Address Form */}
      <form onSubmit={handlePlaceOrder} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={addressData.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={addressData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address *</label>
          <textarea
            name="address"
            value={addressData.address}
            onChange={handleInputChange}
            required
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">City *</label>
            <input
              type="text"
              name="city"
              value={addressData.city}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">State *</label>
            <input
              type="text"
              name="state"
              value={addressData.state}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={addressData.pincode}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Landmark (Optional)</label>
          <input
            type="text"
            name="landmark"
            value={addressData.landmark}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => history.push('/checkout')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Cart
          </button>
          
          <button
            type="submit"
            disabled={isPlacingOrder}
            className="flex-1 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  cartItems: selectCartItems,
  total: selectCartTotal,
  currentUser: state => state.user.currentUser
});

const mapDispatchToProps = dispatch => ({
  clearCart: () => dispatch(clearCart())
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressPage);