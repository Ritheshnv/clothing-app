const API_BASE_URL = 'https://an4mjc3sya.execute-api.us-east-1.amazonaws.com/prod';
const CLOUDFRONT_URL = 'https://d3jifdeyjpus7e.cloudfront.net';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    
    console.log('Fetched products from API:', products);
    
    // If no products, return null to indicate loading failed
    if (!products || products.length === 0) {
      console.log('No products found in API response');
      return null;
    }
    
    // Transform products to match existing shop data structure
    const transformedData = {};
    
    products.forEach(product => {
      const category = product.category;
      
      if (!transformedData[category]) {
        transformedData[category] = {
          id: Object.keys(transformedData).length + 1,
          title: getCategoryTitle(category),
          routeName: category,
          items: []
        };
      }
      
      transformedData[category].items.push({
        id: product.id,
        name: product.title,
        imageUrl: `${CLOUDFRONT_URL}/${product.mainImageKey}`,
        price: product.price,
        description: product.description,
        alternateText: product.alternateText,
        subImages: product.subImages?.map(img => `${CLOUDFRONT_URL}/${img}`) || [],
        stock: product.stock,
        offers: product.offers,
        isActive: product.isActive,
        tag: product.tag
      });
      
      if (product.tag) {
        console.log(`Product ${product.id} has tag: ${product.tag}`);
      }
    });
    
    console.log('Transformed data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return null instead of empty object to indicate failure
    return null;
  }
};

const getCategoryTitle = (category) => {
  const categoryTitles = {
    silk: 'Silk Sarees',
    cotton: 'Cotton Sarees', 
    party: 'Party Wear',
    ceremony: 'Ceremonies',
    haldi: 'Haldi',
    sangeeth: 'Sangeeth',
    reception: 'Reception Trends',
    wedding: 'Wedding Sarees'
  };
  return categoryTitles[category] || category.charAt(0).toUpperCase() + category.slice(1);
};