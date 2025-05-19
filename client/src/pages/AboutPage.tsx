import Header from '../components/Header'
import Footer from '../components/Footer'

import styles from '../styles/Home.module.css'

import student from '../assets/student.jpeg'



const AboutPage = () => {
  return (
    <div>
      <Header />
      <main>
        <div class="viewport">
          <div class={styles.logo}>
            <div>
              <h3>
                <strong>Ivan</strong> Frezza
              </h3>
              <img src={student} alt="student"  style={{ borderRadius: '50%' }} />
            </div>
          </div>
          <div class="center">
            Hello! My name is Ivan, and this website was created as part of my final project for my degree in Contemporary Software Development. It was developed for academic purposes only and is not intended for production use.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AboutPage