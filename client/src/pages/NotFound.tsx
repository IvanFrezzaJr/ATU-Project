import Header from '../components/Header'
import Footer from '../components/Footer'

import styles from '../styles/Home.module.css'

import zoro from '../assets/404.png'

import { Link } from 'wouter-preact'

const NotFound = () => {
  return (
    <div>
      <Header />
      <main>
        <div class="viewport">
          <div class={styles.logo}>
            <div>
              <h3>
                <strong>404</strong> Page Not Found
              </h3>
              <img src={zoro} alt="logo" />
              <div class="center small">
                <small>
                  Image credits:{' '}
                  <Link href="https://www.deviantart.com/schram92/art/sleeping-zoro-in-color-374383166">
                    Schram92
                  </Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFound
