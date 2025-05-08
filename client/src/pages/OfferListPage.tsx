import { useEffect, useState } from 'preact/hooks';
import { useParams, useLocation } from 'wouter-preact';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ItemList from '../components/ItemList';
import ItemDetailCard from '../components/ItemDetailCard';
import style from '../styles/ItemDetail.module.css';

import { getItemById, getPaginatedItems } from '../services/itemService';
import { PageType } from '../types/page';
import { UserItemResponse } from '../types/item';
import { useAuth } from '../context/AuthContext';

const OfferListPage = () => {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [item, setItem] = useState<UserItemResponse | null>(null);
  const [items, setItems] = useState<UserItemResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 2;
  

  const { token, user } = useAuth();


  useEffect(() => {
    if (!token) {
      setLocation('/');
    }
  }, [token]);

  useEffect(() => {
    const fetchItem = async () => {
      const itemIdStr = params[0];
      if (!itemIdStr) return;

      try {
        const itemId = parseInt(itemIdStr, 10);
        const result = await getItemById(itemId);
        setItem(result);
      } catch (error) {
        console.error('Erro ao buscar item:', error);
      }
    };

    fetchItem();
  }, [params]);

  useEffect(() => {
    const fetchOffers = async () => {
      if (!user) return;
      try {
        const result = await getPaginatedItems({
          page: currentPage,
          itemsPerPage,
          userId: parseInt(user.id),
          token,
        });
        setItems(result.data);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Erro ao buscar ofertas:', error);
      }
    };

    fetchOffers();
  }, [item, currentPage]);

  if (!item) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <main>
        <div class="viewport">
          <div className={style.content}>
            <h1 class="center">Product Detail</h1>
            <ItemDetailCard
              productId={item.id}
              productName={item.name}
              productDescription={item.description}
              productImage={item.imagesPath[0]}
              userImage={item.user.image}
              userName={item.user.name}
              postDate={item.createdAt}
              quantity={item.quantity}
              status={item.status}
              tradeType={item.tradeType}
            />

            <h2 class="center">What would you offer?</h2>
            <ItemList
              user={user}
              items={items}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              page={PageType.Offers}
              item={item}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OfferListPage;
