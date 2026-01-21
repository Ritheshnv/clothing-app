import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { updateUserProfile, firestore } from '../../firebase/firebase.utils';
import FormInput from '../../components/form-input/form-input.component';
import CustomButton from '../../components/custom-button/custom-button.component';

const ProfilePage = ({ currentUser }) => {
    const [userProfile, setUserProfile] = useState({
        displayName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (currentUser) {
            fetchUserProfile();
        }
    }, [currentUser]);

    const fetchUserProfile = async () => {
        try {
            const userId = currentUser.id || currentUser.uid;
            console.log('Fetching user profile for:', userId);
            
            if (!userId) {
                console.error('No user ID found for fetching profile');
                return;
            }
            
            const userRef = firestore.doc(`users/${userId}`);
            const snapshot = await userRef.get();
            
            console.log('User document exists:', snapshot.exists);
            
            if (snapshot.exists) {
                const userData = snapshot.data();
                console.log('User data from Firestore:', userData);
                setUserProfile({
                    displayName: userData.displayName || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    city: userData.city || '',
                    zipCode: userData.zipCode || ''
                });
            } else {
                console.log('No user document found, using default values');
                setUserProfile({
                    displayName: currentUser.displayName || '',
                    email: currentUser.email || '',
                    phone: '',
                    address: '',
                    city: '',
                    zipCode: ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        console.log('Profile form submitted');
        console.log('Current user:', currentUser);
        console.log('Current user ID:', currentUser.id);
        console.log('User profile data:', userProfile);

        // Use the correct user ID property
        const userId = currentUser.id || currentUser.uid;
        console.log('Using user ID:', userId);

        if (!userId) {
            console.error('No user ID found');
            setMessage('Error: User ID not found. Please sign out and sign in again.');
            setLoading(false);
            return;
        }

        try {
            const success = await updateUserProfile(userId, userProfile);
            
            console.log('Update result:', success);
            
            if (success) {
                setMessage('Profile updated successfully!');
                setIsEditing(false);
            } else {
                setMessage('Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setMessage(error.message || 'Failed to update profile. Please try again.');
        }
        
        setLoading(false);
    };

    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p>Please sign in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="bg-white rounded-lg shadow-md p-6" style={{backgroundColor: '#FEF8F1'}}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    {!isEditing && (
                        <CustomButton onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </CustomButton>
                    )}
                </div>

                {message && (
                    <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        name="displayName"
                        label="Full Name"
                        type="text"
                        value={userProfile.displayName}
                        handleChange={handleChange}
                        disabled={!isEditing}
                        required
                    />
                    
                    <FormInput
                        name="email"
                        label="Email"
                        type="email"
                        value={userProfile.email}
                        handleChange={handleChange}
                        disabled={true}
                    />
                    
                    <FormInput
                        name="phone"
                        label="Phone Number"
                        type="tel"
                        value={userProfile.phone}
                        handleChange={handleChange}
                        disabled={!isEditing}
                    />
                    
                    <FormInput
                        name="address"
                        label="Address"
                        type="text"
                        value={userProfile.address}
                        handleChange={handleChange}
                        disabled={!isEditing}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            name="city"
                            label="City"
                            type="text"
                            value={userProfile.city}
                            handleChange={handleChange}
                            disabled={!isEditing}
                        />
                        
                        <FormInput
                            name="zipCode"
                            label="ZIP Code"
                            type="text"
                            value={userProfile.zipCode}
                            handleChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    {isEditing && (
                        <div className="flex space-x-4 pt-4">
                            <CustomButton type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </CustomButton>
                            <CustomButton 
                                type="button" 
                                onClick={() => {
                                    setIsEditing(false);
                                    fetchUserProfile();
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </CustomButton>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

const mapStateToProps = ({ user: { currentUser } }) => ({
    currentUser
});

export default connect(mapStateToProps)(ProfilePage);