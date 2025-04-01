import Header from '../components/Header';
import Footer from '../components/Footer';

import styles from '../styles/Home.module.css';

import logo from '../assets/logo.svg';

const Home = () => {
  return (
    <div>
      <Header />
      <main>
        <div class="viewport">
          <div class={styles.logo}>
          <div>
            <h3><strong>Barter</strong> exchange platform</h3>
            <img src={logo} alt="logo" />
          </div>
        </div>
          <form role="search">
            <input name="search" type="search" placeholder="Search" />
            <input type="submit" value="Search" />
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
