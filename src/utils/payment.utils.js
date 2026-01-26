// Razorpay configuration
export const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_your_key_here';

// Load Razorpay script
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Create Razorpay order
export const createRazorpayOrder = async (amount, currency = 'INR') => {
    try {
        // In production, this should call your backend API
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount * 100, // Razorpay expects amount in paise
                currency,
            }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to create order');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating order:', error);
        // For demo purposes, return a mock order
        return {
            id: 'order_' + Date.now(),
            amount: amount * 100,
            currency,
        };
    }
};

// Process payment
export const processPayment = async (orderData, userDetails, onSuccess, onFailure) => {
    const isLoaded = await loadRazorpayScript();
    
    if (!isLoaded) {
        onFailure('Failed to load payment gateway');
        return;
    }

    const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Dihana Couture',
        description: 'Fashion Purchase',
        order_id: orderData.id,
        handler: function (response) {
            // Payment successful
            onSuccess({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
            });
        },
        prefill: {
            name: userDetails.name || '',
            email: userDetails.email || '',
            contact: userDetails.phone || '',
        },
        notes: {
            address: userDetails.address || '',
        },
        theme: {
            color: '#10B981', // Green color matching your theme
        },
        modal: {
            ondismiss: function() {
                onFailure('Payment cancelled by user');
            }
        }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
};