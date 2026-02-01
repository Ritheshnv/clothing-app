import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import OrderStatus from '../../components/order-status/order-status.component';

const OrdersPage = ({ currentUser }) => {
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [showTracking, setShowTracking] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      console.log('Current user:', currentUser);
      fetchUserOrders();
    }
  }, [currentUser]);

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      console.log('Fetching orders for user ID:', currentUser.id);
      const response = await fetch(`https://an4mjc3sya.execute-api.us-east-1.amazonaws.com/prod/orders/user/${currentUser.id}`);
      console.log('API Response status:', response.status);
      const orders = await response.json();
      console.log('Orders received:', orders);
      setUserOrders(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (trackingOrderId.trim()) {
      setShowTracking(true);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-orange-100 text-orange-800',
      in_transit: 'bg-yellow-100 text-yellow-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Please sign in to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Order Tracking Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Track Your Order</h2>
        <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter Order ID (e.g., ORD-12345)"
            value={trackingOrderId}
            onChange={(e) => setTrackingOrderId(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto"
          >
            Track Order
          </button>
        </form>
      </div>

      {/* Order Status Display */}
      {showTracking && trackingOrderId && (
        <div className="mb-8">
          <OrderStatus orderId={trackingOrderId} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6" style={{backgroundColor: '#FEF8F1'}}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <button
            onClick={fetchUserOrders}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors w-full sm:w-auto"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Loading orders...</p>
          </div>
        ) : userOrders.length > 0 ? (
          <div className="space-y-4">
            {userOrders.map(order => (
              <div key={order.orderId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{order.orderId}</h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Items:</p>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t gap-3">
                  <span className="font-semibold">Total: ₹{order.totalAmount}</span>
                  <button
                    onClick={() => {
                      setTrackingOrderId(order.orderId);
                      setShowTracking(true);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors w-full sm:w-auto"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className=" mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className=" mb-6">When you place your first order, it will appear here.</p>
            <a 
              href="/" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
            >
              Start Shopping
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser
});

export default connect(mapStateToProps)(OrdersPage);