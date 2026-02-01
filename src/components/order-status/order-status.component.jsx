import React, { useState, useEffect } from 'react';

const OrderStatus = ({ orderId }) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusSteps = [
    { key: 'placed', label: 'Order Placed', icon: '📋', color: 'bg-blue-500' },
    { key: 'shipped', label: 'Shipped', icon: '📦', color: 'bg-orange-500' },
    { key: 'in_transit', label: 'In Transit', icon: '🚚', color: 'bg-yellow-500' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🏃', color: 'bg-purple-500' },
    { key: 'delivered', label: 'Delivered', icon: '✅', color: 'bg-green-500' }
  ];

  useEffect(() => {
    if (orderId) {
      fetchOrderStatus();
    }
  }, [orderId]);

  const fetchOrderStatus = async () => {
    try {
      setLoading(true);
      // Replace with your actual API Gateway URL after deployment
      const response = await fetch(`https://an4mjc3sya.execute-api.us-east-1.amazonaws.com/prod/orders/${orderId}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setOrderData(data);
      }
    } catch (err) {
      setError('Failed to fetch order status');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!orderData?.status) return 0;
    return statusSteps.findIndex(step => step.key === orderData.status);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
        <span className='ml-2'>Loading order status...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  const currentStep = getCurrentStepIndex();

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <div className='mb-6'>
        <div className='flex justify-between items-start mb-2'>
          <h2 className='text-2xl font-bold'>Order #{orderId}</h2>
          <button
            onClick={fetchOrderStatus}
            disabled={loading}
            className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors'
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        {orderData?.trackingNumber && (
          <p className='text-gray-600'>Tracking: {orderData.trackingNumber}</p>
        )}
        {orderData?.estimatedDelivery && (
          <p className='text-gray-600'>
            Estimated Delivery: {new Date(orderData.estimatedDelivery).toLocaleDateString()}
          </p>
        )}
      </div>
      
      <div className='relative'>
        {statusSteps.map((step, index) => (
          <div key={step.key} className='flex items-center mb-8 last:mb-0'>
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
              index <= currentStep 
                ? `${step.color} border-transparent text-white` 
                : 'bg-gray-200 border-gray-300 text-gray-500'
            }`}>
              <span className='text-xl'>{step.icon}</span>
            </div>
            
            <div className='ml-4 flex-1'>
              <h3 className={`font-semibold ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.label}
              </h3>
              {index === currentStep && orderData?.updatedAt && (
                <p className='text-sm text-gray-600'>
                  Updated: {new Date(orderData.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {orderData?.items && (
        <div className='mt-8 pt-6 border-t'>
          <h3 className='font-semibold mb-4'>Order Items</h3>
          <div className='space-y-2'>
            {orderData.items.map((item, index) => (
              <div key={index} className='flex justify-between items-center'>
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
          <div className='mt-4 pt-2 border-t font-semibold'>
            Total: ₹{orderData.totalAmount}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;