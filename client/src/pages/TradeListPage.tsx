
import Header from '../components/Header';
import Footer from '../components/Footer';

import ItemList from '../components/ItemList';

import style from '../styles/ItemDetail.module.css';
import ItemDetail from '../components/ItemDetail';


const item = { index: 1, title: 'ItemDetail Title 1', description: 'Description of the offer 1.', productName: 'Product 1', productDescription: 'Description of product 1.', productImage: 'https://placehold.co/40x40', userImage: 'https://placehold.co/40x40', userName: 'Ivan Frezza', postDate: 'March 25, 2025', offersCount: 5 }

const Offer = () => {
    return (
        <div>
      <Header />
        <main>
            <div class="viewport">
                <div className={style["content"]}>
                <h1 class="center">Product Detail</h1>
                    <ItemDetail
                        key={item.index}
                        title={item.title}
                        description={item.description}
                        productName={item.productName}
                        productDescription={item.productDescription}
                        productImage={item.productImage}
                        userImage={item.userImage}
                        userName={item.userName}
                        postDate={item.postDate}
                        offersCount={23}
                        showFooter={false}
                    />
                    <h2 class="center">What would you offer?</h2>
                    <ItemList />
                </div>
            </div>
        </main>
        <Footer />
    </div>
    );
};

export default Offer;
