
import Header from '../components/Header';
import Footer from '../components/Footer';

import ItemList from '../components/ItemList';

import style from '../styles/ItemDetail.module.css';

import {PageType} from '../types/page';


const Offer = () => {

    return (
        <div>
      <Header />
        <main>
            <div class="viewport">
                <div className={style["content"]}>

                    <h1 class="center">Offer List</h1>
                    <ItemList page={PageType.Offers} />
                </div>
            </div>
        </main>
        <Footer />
    </div>
    );
};

export default Offer;
