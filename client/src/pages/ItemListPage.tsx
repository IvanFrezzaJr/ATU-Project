import { useEffect, useState } from 'preact/hooks'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ItemList from '../components/ItemList'
import style from '../styles/ItemDetail.module.css'

import { getPaginatedItems, searchItemsByTitle } from '../services/itemService'
import { PageType } from '../types/page'
import { UserItemResponse } from '../types/item'
import { useAuth } from '../context/AuthContext'

const ItemListPage = () => {
  const [items, setItems] = useState<UserItemResponse[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 5

  const { token, isLoading } = useAuth()

  const queryParams = new URLSearchParams(window.location.search)

  const searchQuery = queryParams.get('search')?.trim() || ''

  useEffect(() => {
    if (isLoading) return

    if (!token) {
      const fetchItems = async () => {
        try {
          let result = undefined
          console.log('searchQuery', searchQuery)
          if (searchQuery) {
            result = await getPaginatedItems({
              page: currentPage,
              itemsPerPage,
              inOffer: !!token,
              token,
              search: searchQuery,
            })
          } else {
            result = await getPaginatedItems({
              page: currentPage,
              itemsPerPage,
              inOffer: !!token,
              token,
            })
          }
          setItems(result.data)
          setTotalPages(result.totalPages)
          setCurrentPage(result.currentPage)
        } catch (error) {
          console.error('Erro ao buscar itens:', error)
        }
      }
      fetchItems()
    }
  }, [isLoading, token, currentPage, searchQuery])

  useEffect(() => {
    if (!token) return

    const fetchItems = async () => {
      try {
        const result = await getPaginatedItems({
          page: currentPage,
          inOffer: true,
          itemsPerPage,
          token,
        })
        setItems(result.data)
        setTotalPages(result.totalPages)
        setCurrentPage(result.currentPage)
      } catch (error) {
        console.error('Erro ao buscar itens:', error)
      }
    }
    fetchItems()
  }, [currentPage])

  return (
    <>
      <Header />
      <main>
        <div class="viewport">
          <div className={style.content}>
            <h1 class="center">Offer List</h1>
            <ItemList
              items={items}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              page={PageType.Items}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ItemListPage
