import React from 'react';

const ContactPage = () => (
    <div className='max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8 text-center'>Contact Us</h1>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-sm'>
                <h2 className='text-xl font-semibold mb-4'>Get in Touch</h2>
                <div className='space-y-4'>
                    <div>
                        <h3 className='font-medium text-gray-900'>Address</h3>
                        <p className='text-gray-600'>Malleswaram, Bengaluru</p>
                    </div>
                    <div>
                        <h3 className='font-medium text-gray-900'>Phone</h3>
                        <p className='text-gray-600'>+1 (555) 123-4567</p>
                    </div>
                    <div>
                        <h3 className='font-medium text-gray-900'>Email</h3>
                        <p className='text-gray-600'>info@dihanacouture.com</p>
                    </div>
                    <div>
                        <h3 className='font-medium text-gray-900'>Hours</h3>
                        <p className='text-gray-600'>Mon-Fri: 9AM-8PM<br/>Sat-Sun: 10AM-6PM</p>
                    </div>
                </div>
            </div>
            
            <div className='bg-white p-6 rounded-lg shadow-sm'>
                <h2 className='text-xl font-semibold mb-4'>Send Message</h2>
                <form className='space-y-4'>
                    <input 
                        type='text' 
                        placeholder='Your Name' 
                        className='w-full p-3 border border-gray-300 rounded-md'
                    />
                    <input 
                        type='email' 
                        placeholder='Your Email' 
                        className='w-full p-3 border border-gray-300 rounded-md'
                    />
                    <textarea 
                        placeholder='Your Message' 
                        rows='4' 
                        className='w-full p-3 border border-gray-300 rounded-md'
                    />
                    <button className='w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800'>
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </div>
);

export default ContactPage;