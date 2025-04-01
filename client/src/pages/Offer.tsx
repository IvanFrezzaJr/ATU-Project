
import Header from '../components/Header';
import Footer from '../components/Footer';

import OfferList from '../components/OfferList';

import style from '../styles/Offer.module.css';

const Offer = () => {
    return (
        <div>
      <Header />
        <main>
            <div class="viewport">
                <div className={style["content"]}>

                    <h1 class="center">Offer List</h1>
                    <OfferList />
                </div>
            </div>
        </main>
        <Footer />
    </div>
    );
};

export default Offer;
