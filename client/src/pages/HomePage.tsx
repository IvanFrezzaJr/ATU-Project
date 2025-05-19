import Header from '../components/Header'
import Footer from '../components/Footer'
import { useLocation } from 'wouter-preact'

import styles from '../styles/Home.module.css'

import logo from '../assets/logo.svg'
import { Link } from 'wouter-preact'

import { useState } from 'preact/hooks'

const HomePage = () => {
  const [query, setQuery] = useState('')
  const [, setLocation] = useLocation()

  const handleSearch = (e: Event) => {
    e.preventDefault()
    if (query.trim()) {
      setLocation(`/items/?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div>
      <Header />
      <main>
        <div class="viewport">
          <div class={styles.logo}>
            <div>
              <h3>
                <strong>Barter</strong> exchange platform
              </h3>
              <img src={logo} alt="logo" />
            </div>
          </div>
          <form role="search" onSubmit={handleSearch}>
            <input
              name="search"
              type="search"
              placeholder="Search"
              value={query}
              onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            />
            <input type="submit" value="Search" />
          </form>

          <div class="center">
            Don’t you know what you are looking for? <Link href="/items">Click here</Link> to see
            all items
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
