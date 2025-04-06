
import Header from '../components/Header';
import Footer from '../components/Footer';

import ItemList from '../components/ItemList';

import style from '../styles/ItemDetail.module.css';

import { PageType } from '../types/page';



const ItemListPage = () => {

    return (
        <>
            <Header />
                <main>
                    <div class="viewport">
                        <div className={style["content"]}>

                            <h1 class="center">Offer List</h1>

                            <ItemList page={PageType.Items} />

                        </div>
                    </div>
                </main>
            <Footer />
        </>
    );
};

export default ItemListPage;
