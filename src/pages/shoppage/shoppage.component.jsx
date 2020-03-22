import React from 'react';
import SHOP_DATA from './shoppage.data';
import CollectionPreview from '../../components/collection-preview/collection-preview.component';

class ShopPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collections: SHOP_DATA
        }
    }

    render() {
        const { collections } = this.state;
        return (
            <div>
                {collections.map(({ id, ...otherCollections }) => (
                    <CollectionPreview key={id} {...otherCollections} />
                ))
                }
            </div>
        )
    }
}

export default ShopPage;