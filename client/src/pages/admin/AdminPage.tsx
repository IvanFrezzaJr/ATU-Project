// src/pages/AdminLayout.tsx

import { useEffect } from 'preact/hooks';
import { useParams, useLocation } from 'wouter-preact';
import { useAuth } from '../../context/AuthContext';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../../styles/Admin.module.css';

import ProfilePage from './AdminProfilePage';
import ItemPage from './AdminItemPage';
import AdminTradePage from './AdminTradePage';

const AdminLayout = () => {
  const { section } = useParams();
  const [, setLocation] = useLocation();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) setLocation('/');
  }, [token]);

  const renderPage = () => {
    switch (section) {
      case 'profile':
        return <ProfilePage />;
      case 'items':
        return <ItemPage />;
      case 'trades':
        return <AdminTradePage />;
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
            <button onClick={() => setLocation('/admin/profile')}>Profile</button>
            <button onClick={() => setLocation('/admin/items')}>Items</button>
            <button onClick={() => setLocation('/admin/trades')}>Trades</button>
          </nav>
        </aside>
        <main>{renderPage()}</main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
