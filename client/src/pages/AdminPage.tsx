import ProfilePage from './ProfilePage';
import ItemPage from './ItemPage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Admin.module.css';
import { useState } from 'preact/hooks';


const AdminPage = () => {
    const [page, setPage] = useState('profile');

    const renderPage = () => {
        switch (page) {
            case 'profile':
                return <ProfilePage />;
            case 'items':
                return <ItemPage />;
            case 'trades':
                return <div>Trades Page</div>; 
            default:
                return <ProfilePage />;
        }
    };
    
    return (
        <div>
            <Header />

            <div className={styles.layout}>
                <aside>
                    <nav className={styles.menu}>
                        <button onClick={() => setPage('profile')}>Profile</button>
                        <button onClick={() => setPage('items')}>Items</button>
                        <button onClick={() => setPage('trades')}>Trades</button>
                    </nav>
                </aside>
                <main>
                    {renderPage()}
                </main>
            </div>
            <Footer />
        </div >
    );
};

export default AdminPage;
