// Sample script to populate DynamoDB with products
// Run this after deploying your CDK stack

const sampleProducts = [
  {
    id: 'silk-001',
    title: 'Elegant Red Silk Saree',
    category: 'silk',
    price: 15000,
    description: 'Beautiful handwoven silk saree perfect for weddings',
    mainImageKey: 'sarees/silk/silk-001/main.jpg',
    subImages: ['sarees/silk/silk-001/detail1.jpg', 'sarees/silk/silk-001/detail2.jpg'],
    stock: 5,
    isActive: true,
    offers: ['Free shipping', '10% off on first order'],
    alternateText: 'Red silk wedding saree'
  },
  {
    id: 'cotton-001',
    title: 'Comfortable Cotton Saree',
    category: 'cotton',
    price: 3500,
    description: 'Lightweight cotton saree for daily wear',
    mainImageKey: 'sarees/cotton/cotton-001/main.jpg',
    subImages: ['sarees/cotton/cotton-001/detail1.jpg'],
    stock: 10,
    isActive: true,
    offers: ['Free shipping'],
    alternateText: 'Cotton daily wear saree'
  },
  {
    id: 'party-001',
    title: 'Glamorous Party Wear',
    category: 'party',
    price: 8500,
    description: 'Stunning party wear saree with embellishments',
    mainImageKey: 'sarees/party/party-001/main.jpg',
    subImages: ['sarees/party/party-001/detail1.jpg', 'sarees/party/party-001/detail2.jpg'],
    stock: 3,
    isActive: true,
    offers: ['Free shipping', 'Gift wrapping available'],
    alternateText: 'Party wear embellished saree'
  }
];

export default sampleProducts;