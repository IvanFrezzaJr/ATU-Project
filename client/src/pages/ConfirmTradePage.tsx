import Header from '../components/Header';
import Footer from '../components/Footer';

import styles from '../styles/Home.module.css';

import logo from '../assets/logo.svg';

import { Link } from 'wouter-preact';

const ConfirmTradePage = () => {
    return (
        <div>
            <Header />
            <main>
                <div class="viewport">
                    <div class={styles.logo}>
                        <div>
                            <h3><strong>Exchange </strong> Porposed Successful</h3>
                            <p>Waiting for the user confirmation. </p>
                            <img src={logo} alt="logo" />
                            <p>Check the proposal status in the <Link href='/admin/trades'>user panel</Link>.</p>
                            <div class="center small"><Link href='/'>Redirect to home page</Link></div>
                        </div>
                    </div>  
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default ConfirmTradePage;
