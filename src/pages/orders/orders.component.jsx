import React from 'react';
import { connect } from 'react-redux';

const OrdersPage = ({ currentUser }) => {
    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p>Please sign in to view your orders.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-lg shadow-md p-6" style={{backgroundColor: '#FEF8F1'}}>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>
                
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">When you place your first order, it will appear here.</p>
                    <a 
                        href="/" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                    >
                        Start Shopping
                    </a>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = ({ user: { currentUser } }) => ({
    currentUser
});

export default connect(mapStateToProps)(OrdersPage);