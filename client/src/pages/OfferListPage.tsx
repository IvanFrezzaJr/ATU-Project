
import Header from '../components/Header';
import Footer from '../components/Footer';

import ItemList from '../components/ItemList';

import style from '../styles/ItemDetail.module.css';
import ItemDetailCard from '../components/ItemDetailCard';

import itemService from '../services/itemService';
import { useEffect, useState } from 'preact/hooks';

import { useParams } from 'wouter-preact';
import { UserItemResponse } from '../types/item';
import { PageType } from '../types/page';



const OfferListPage = () => {
    const params = useParams();
    const [item, setItem] = useState<UserItemResponse | null>(null);


    useEffect(() => {
        if (params) {
            const itemIdParam = params[0]
            if (itemIdParam) {
                const itemId = parseInt(itemIdParam, 10);
                const result = itemService.getById(itemId);

                if (result) {
                    setItem(result);
                    
                }
            }
        }
    }, [params]);


    if (!item) {
        return <div>Loading...</div>;
    }


    return (
        <>
            <Header />
                <main>
                    <div class="viewport">
                        <div className={style["content"]}>
                            <h1 class="center">Product Detail</h1>
                            <ItemDetailCard
                                productId={item.id}
                                productName={item.name}
                                productDescription={item.description}
                                productImage={item.imagesPath[0]}
                                userImage={item.user.image}
                                userName={item.user.name}
                                postDate={item.createdAt}
                                offersCount={2}
                            />
                            <h2 class="center">What would you offer?</h2>

                            <ItemList page={PageType.Offers} item={item} />

                        </div>
                    </div>
                </main>
            <Footer />
        </>
    );
};

export default OfferListPage;
