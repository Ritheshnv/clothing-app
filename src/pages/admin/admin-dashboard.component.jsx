import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

const AdminDashboard = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [migrationStatus, setMigrationStatus] = useState('');
  const [productForm, setProductForm] = useState({
    id: '',
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    tag: '',
    alternateText: '',
    offerType: 'percentage',
    offerValue: '',
    isActive: true
  });
  const [mainImage, setMainImage] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadTasks, setUploadTasks] = useState([]);

  // Save upload tasks to localStorage whenever they change
  useEffect(() => {
    console.log('Saving upload tasks to localStorage:', uploadTasks);
    localStorage.setItem('adminUploadTasks', JSON.stringify(uploadTasks));
  }, [uploadTasks]);
  const history = useHistory();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      history.push('/admin');
      return;
    }
    fetchAllOrders();
    
    // Load saved upload tasks from localStorage
    const savedTasks = localStorage.getItem('adminUploadTasks');
    console.log('Saved tasks from localStorage:', savedTasks);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        console.log('Parsed tasks:', parsedTasks);
        setUploadTasks(parsedTasks);
      } catch (error) {
        console.error('Error loading saved upload tasks:', error);
      }
    }
  }, [currentUser, history]);

  const fetchAllOrders = async () => {
    try {
      // This would need a new API endpoint to get all orders
      // For now, we'll show a placeholder
      setOrders([]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://an4mjc3sya.execute-api.us-east-1.amazonaws.com/prod/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert('Order status updated successfully');
        fetchAllOrders();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      alert('Error updating order status');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    const taskId = Date.now().toString();
    const newTask = {
      id: taskId,
      productId: productForm.id,
      title: productForm.title,
      status: 'uploading',
      progress: 'Starting upload...',
      timestamp: new Date().toISOString()
    };
    
    setUploadTasks(prev => [...prev, newTask]);
    
    // Clear form immediately
    const formData = { ...productForm };
    const mainImageFile = mainImage;
    const subImageFiles = [...subImages];
    
    setProductForm({
      id: '',
      title: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      alternateText: '',
      offerType: 'percentage',
      offerValue: '',
      isActive: true
    });
    setMainImage(null);
    setSubImages([]);
    
    // Clear file input fields
    const mainImageInput = document.querySelector('input[type="file"]:not([multiple])');
    const subImagesInput = document.querySelector('input[type="file"][multiple]');
    if (mainImageInput) mainImageInput.value = '';
    if (subImagesInput) subImagesInput.value = '';
    
    // Process upload in background
    processUpload(taskId, formData, mainImageFile, subImageFiles);
  };

  const processUpload = async (taskId, formData, mainImageFile, subImageFiles) => {
    try {
      // Update progress
      setUploadTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, progress: 'Uploading main image...' }
          : task
      ));
      
      // Upload main image
      let mainImageKey = '';
      if (mainImageFile) {
        mainImageKey = await uploadImage(mainImageFile, 'main.jpg', formData.category, formData.id);
      }
      
      // Update progress
      setUploadTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, progress: 'Uploading sub images...' }
          : task
      ));
      
      // Upload sub images
      const subImageKeys = [];
      for (let i = 0; i < subImageFiles.length; i++) {
        const key = await uploadImage(subImageFiles[i], `sub-${i + 1}.jpg`, formData.category, formData.id);
        subImageKeys.push(key);
      }
      
      // Update progress
      setUploadTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, progress: 'Saving to database...' }
          : task
      ));
      
      const productData = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        currency: 'INR',
        offers: {
          type: formData.offerType,
          value: parseInt(formData.offerValue) || 0
        },
        stock: parseInt(formData.stock),
        category: formData.category,
        tag: formData.tag,
        alternateText: formData.alternateText,
        mainImageKey: mainImageKey,
        subImages: subImageKeys,
        isActive: formData.isActive
      };
      
      // Save product to DynamoDB
      const response = await fetch('https://an4mjc3sya.execute-api.us-east-1.amazonaws.com/prod/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        setUploadTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, status: 'success', progress: 'Product created successfully!' }
            : task
        ));
      } else {
        throw new Error('Failed to save product to database');
      }
    } catch (error) {
      setUploadTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'failed', progress: `Error: ${error.message}` }
          : task
      ));
    }
  };

  const uploadImage = async (file, fileName, category, productId) => {
    // Get signed upload URL
    const urlResponse = await fetch('https://an4mjc3sya.execute-api.us-east-1.amazonaws.com/prod/upload-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        category: category,
        productId: productId,
        fileName: fileName
      })
    });
    
    const { uploadUrl, key } = await urlResponse.json();
    
    // Upload file to S3
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': 'image/jpeg'
      }
    });
    
    return key;
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const logout = () => {
    history.push('/');
  };

  const migrateProducts = async () => {
    setMigrationStatus('Starting migration...');
    try {
      const response = await fetch('https://an4mjc3sya.execute-api.us-east-1.amazonaws.com/prod/products');
      const products = await response.json();
      
      setMigrationStatus(`Found ${products.length} products. Updating...`);
      
      for (const product of products) {
        if (!product.tag) {
          await fetch(`https://an4mjc3sya.execute-api.us-east-1.amazonaws.com/prod/products/${product.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...product, tag: '' })
          });
        }
      }
      
      setMigrationStatus('Migration completed successfully!');
    } catch (error) {
      setMigrationStatus(`Migration failed: ${error.message}`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {currentUser?.displayName || currentUser?.email}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Order Management
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Product Management
              </button>
              <button
                onClick={() => setActiveTab('uploads')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'uploads'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upload Status
              </button>
              <button
                onClick={() => setActiveTab('migration')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'migration'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Migration
              </button>
            </nav>
          </div>

          {/* Order Management Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Management</h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2">Loading orders...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <p className="text-yellow-800">
                        <strong>Note:</strong> To manage orders, you can:
                      </p>
                      <ul className="mt-2 text-yellow-700 list-disc list-inside">
                        <li>Access AWS DynamoDB console to view all orders</li>
                        <li>Update order status using the update-item command</li>
                        <li>Use the order ID to track specific orders</li>
                      </ul>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3">Quick Status Update</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Order ID
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Order ID (e.g., ORD-1234567890)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            id="orderIdInput"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Status
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            id="statusSelect"
                          >
                            <option value="">Select Status</option>
                            <option value="placed">Placed</option>
                            <option value="shipped">Shipped</option>
                            <option value="in_transit">In Transit</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const orderId = document.getElementById('orderIdInput').value;
                          const status = document.getElementById('statusSelect').value;
                          if (orderId && status) {
                            updateOrderStatus(orderId, status);
                          } else {
                            alert('Please enter both Order ID and select a status');
                          }
                        }}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product Management Tab */}
          {activeTab === 'products' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h2>
                
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product ID</label>
                      <input
                        type="text"
                        name="id"
                        value={productForm.id}
                        onChange={handleProductChange}
                        placeholder="e.g., saree-001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={productForm.title}
                        onChange={handleProductChange}
                        placeholder="e.g., Pure Silk Kanchipuram Saree"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleProductChange}
                      placeholder="e.g., Handwoven silk saree with gold zari"
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (INR)</label>
                      <input
                        type="number"
                        name="price"
                        value={productForm.price}
                        onChange={handleProductChange}
                        placeholder="12999"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={productForm.stock}
                        onChange={handleProductChange}
                        placeholder="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category (Collection)</label>
                      <input
                        type="text"
                        name="category"
                        value={productForm.category}
                        onChange={handleProductChange}
                        placeholder="silk, cotton"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tag (Display Category)</label>
                    <select
                      name="tag"
                      value={productForm.tag}
                      onChange={handleProductChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">None</option>
                      <option value="trending">Trending Now</option>
                      <option value="bestseller">Best Seller</option>
                      <option value="wedding">Wedding Selection</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type</label>
                      <select
                        name="offerType"
                        value={productForm.offerType}
                        onChange={handleProductChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Offer Value</label>
                      <input
                        type="number"
                        name="offerValue"
                        value={productForm.offerValue}
                        onChange={handleProductChange}
                        placeholder="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Text</label>
                    <input
                      type="text"
                      name="alternateText"
                      value={productForm.alternateText}
                      onChange={handleProductChange}
                      placeholder="Red silk kanchipuram saree"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setMainImage(e.target.files[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Images</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setSubImages(Array.from(e.target.files))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={productForm.isActive}
                      onChange={handleProductChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Product is active
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                    >
                      Add Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Upload Status Tab */}
          {activeTab === 'uploads' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Status</h2>
                
                <div className="mb-4">
                  <button
                    onClick={() => {
                      setUploadTasks([]);
                      localStorage.removeItem('adminUploadTasks');
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                  >
                    Clear All History
                  </button>
                </div>
                
                {uploadTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No uploads yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {uploadTasks.slice().reverse().map(task => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm text-gray-600">ID: {task.productId}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            task.status === 'success' 
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status === 'success' ? 'Success' : task.status === 'failed' ? 'Failed' : 'Uploading'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{task.progress}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(task.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Migration Tab */}
          {activeTab === 'migration' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Product Migration</h2>
                <p className="text-gray-600 mb-4">Add the 'tag' field to existing products in the database.</p>
                
                <button
                  onClick={migrateProducts}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                >
                  Run Migration
                </button>
                
                {migrationStatus && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-blue-800">{migrationStatus}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser
});

export default connect(mapStateToProps)(AdminDashboard);