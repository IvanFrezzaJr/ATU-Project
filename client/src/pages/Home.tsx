import Header from '../components/Header';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <div>
      <Header />
      <main>
        <div class={styles.formWrapper}>
          <Logo />
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
