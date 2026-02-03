const INITIAL_STATE = {
  sections: [
    {
      title: 'Sangeeth',
      imageUrl: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-1/main.jpg',
      id: 1,
      linkUrl: 'shop/silk'
    },
    {
      title: 'Haldi',
      imageUrl: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/cotton/cotton-1/main.jpg',
      id: 2,
      linkUrl: 'shop/cotton'
    },
    {
      title: 'Reception Trends',
      imageUrl: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-2/main.jpg',
      id: 3,
      linkUrl: 'shop/silk'
    },
    {
      title: 'Wedding Flash',
      imageUrl: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-4/main.jpg',
      id: 4,
      linkUrl: 'shop/silk'
    },
    {
      title: 'Party Freak',
      imageUrl: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/cotton/cotton-2/main.jpg',
      id: 5,
      linkUrl: 'shop/cotton'
    }
  ]
};


const directoryReducer = (state=INITIAL_STATE, action) => {
  switch(action.type) {
    default:
      return state;
  }
}

export default directoryReducer;