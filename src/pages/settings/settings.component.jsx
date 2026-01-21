import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { updateUserProfile, firestore } from '../../firebase/firebase.utils';
import CustomButton from '../../components/custom-button/custom-button.component';

const SettingsPage = ({ currentUser }) => {
    const [preferences, setPreferences] = useState({
        emailMarketing: false,
        smsMarketing: false,
        pushNotifications: false,
        newArrivals: false,
        salesAlerts: false,
        orderUpdates: true
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (currentUser) {
            fetchUserPreferences();
        }
    }, [currentUser]);

    const fetchUserPreferences = async () => {
        try {
            const userRef = firestore.doc(`users/${currentUser.id}`);
            const snapshot = await userRef.get();
            if (snapshot.exists) {
                const userData = snapshot.data();
                if (userData.marketingPreferences) {
                    setPreferences(prev => ({
                        ...prev,
                        ...userData.marketingPreferences
                    }));
                }
            }
        } catch (error) {
            console.log('Error fetching preferences:', error);
        }
    };

    const handleToggle = (preference) => {
        setPreferences(prev => ({
            ...prev,
            [preference]: !prev[preference]
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        const success = await updateUserProfile(currentUser.id, {
            marketingPreferences: preferences
        });
        
        if (success) {
            setMessage('Settings updated successfully!');
        } else {
            setMessage('Failed to update settings. Please try again.');
        }
        
        setLoading(false);
    };

    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p>Please sign in to view your settings.</p>
            </div>
        );
    }

    const ToggleSwitch = ({ checked, onChange, label, description }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{label}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            <button
                type="button"
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    checked ? 'bg-blue-600' : 'bg-gray-200'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="bg-white rounded-lg shadow-md p-6" style={{backgroundColor: '#FEF8F1'}}>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

                {message && (
                    <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Marketing Preferences</h2>
                        <div className="space-y-2">
                            <ToggleSwitch
                                checked={preferences.emailMarketing}
                                onChange={() => handleToggle('emailMarketing')}
                                label="Email Marketing"
                                description="Receive promotional emails about new products and offers"
                            />
                            
                            <ToggleSwitch
                                checked={preferences.smsMarketing}
                                onChange={() => handleToggle('smsMarketing')}
                                label="SMS Marketing"
                                description="Receive text messages about exclusive deals and promotions"
                            />
                            
                            <ToggleSwitch
                                checked={preferences.pushNotifications}
                                onChange={() => handleToggle('pushNotifications')}
                                label="Push Notifications"
                                description="Receive browser notifications for important updates"
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Updates</h2>
                        <div className="space-y-2">
                            <ToggleSwitch
                                checked={preferences.newArrivals}
                                onChange={() => handleToggle('newArrivals')}
                                label="New Arrivals"
                                description="Be the first to know about new collections and products"
                            />
                            
                            <ToggleSwitch
                                checked={preferences.salesAlerts}
                                onChange={() => handleToggle('salesAlerts')}
                                label="Sales Alerts"
                                description="Get notified about sales, discounts, and special offers"
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Communications</h2>
                        <div className="space-y-2">
                            <ToggleSwitch
                                checked={preferences.orderUpdates}
                                onChange={() => handleToggle('orderUpdates')}
                                label="Order Updates"
                                description="Receive important updates about your orders (recommended)"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <CustomButton type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Settings'}
                        </CustomButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

const mapStateToProps = ({ user: { currentUser } }) => ({
    currentUser
});

export default connect(mapStateToProps)(SettingsPage);