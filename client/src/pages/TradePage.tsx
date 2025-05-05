
import Header from '../components/Header';
import Footer from '../components/Footer';


import { useLocation } from 'wouter-preact';

import style from '../styles/ItemDetail.module.css';
import ItemDetailCard from '../components/ItemDetailCard';

import {getItemById} from '../services/itemService';
import { useEffect, useState } from 'preact/hooks';

import { useParams } from 'wouter-preact';
import { UserItemResponse } from '../types/item';


const DeliveryDetail = () => {
    return (
        <>
            <h3 class="center">Trade Details</h3>
            <div class="trade-info">
                <fieldset>
                    <p><small><strong>Send by:</strong> post</small></p>
                    <p><small><strong>Receive at:</strong>16 Sallymount avenue, Dublin, Ireland - D023212</small></p>
                </fieldset> 
            </div>
        </>
    )
}

const TradePage = () => {
    const params = useParams();
    const [item, setItem] = useState<UserItemResponse | null>(null);
    const [offerItem, setOffetItem] = useState<UserItemResponse | null>(null);
    const [, navigate] = useLocation(); 


    useEffect(() => {
        const fetchItem = async () => {
            try {
                if (params) {
                    const itemIdParam = params[0];
                    const offerItemIdParam = params[1];

                    if (itemIdParam) {
                        const itemId = parseInt(itemIdParam, 10);
                        const result = await getItemById(itemId);

                        if (result) {
                            setItem(result);
                        }
                    }

                    if (offerItemIdParam) {
                        const oitemId = parseInt(offerItemIdParam, 10);
                        const offerResult = await  getItemById(oitemId);
                        if (offerResult) {
                            setOffetItem(offerResult);
                        }
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar itens:', error);
            }
        }

        fetchItem();
    }, [params]);


    const handleSubmit = (e: Event) => {
        e.preventDefault();
    
        // Aqui você pode fazer o processamento do formulário
    
        // Após o processamento, navega para outra página
        navigate('/confirm');
      };


    if (!item || !offerItem) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            <Header />
            <main>
                <div class="viewport">
                    <div className={style["content"]}>
                        <h1 class="center">You will trade this item:</h1>
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
                        <DeliveryDetail />

          
                        <h1 class="center">For this item:</h1>
                        <ItemDetailCard
                            productId={offerItem.id}
                            productName={offerItem.name}
                            productDescription={offerItem.description}
                            productImage={offerItem.imagesPath[0]}
                            userImage={offerItem.user.image}
                            userName={offerItem.user.name}
                            postDate={offerItem.createdAt}
                            offersCount={2}
                        />
                        <DeliveryDetail />

                        <form onSubmit={handleSubmit}>
                            <button type="submit">Trade</button>
                        </form>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TradePage;
