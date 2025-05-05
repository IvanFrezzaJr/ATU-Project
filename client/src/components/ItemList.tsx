import ItemDetailCard from './ItemDetailCard';
import Pagination from './Pagination';
import { UserItemResponse, PaginationResult, ItemDetailFooterSetup } from '../types/item';
import {getPaginatedItems} from "../services/itemService";
import { useEffect, useState } from 'preact/hooks';
import { PageType } from '../types/page';
import { useAuth } from '../context/AuthContext';



interface ItemListProps {
  page: PageType;
  item?: UserItemResponse;
}

const ItemList = (itemListProps: ItemListProps) => {
  const [items, setItems] = useState<UserItemResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationResult<UserItemResponse> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const { token } = useAuth();

  console.log(token);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await getPaginatedItems(currentPage, itemsPerPage, true, token);
        setItems(result.data);
        setPagination(result);
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
      }
    };
  
    fetchItems();
  }, [currentPage, itemsPerPage]);



  const itemDetailFooterSetup: ItemDetailFooterSetup = {
    userInfo: {
      show: true
    },
    actionMenu: {
      show: true
    },
    page: itemListProps.page,
    item: itemListProps.item,
  };


  if (!pagination) return <p>Loading...</p>;

  return (
    <div>
      {items.map((item: UserItemResponse) => (
          <ItemDetailCard
            productId={item.id}
            productName={item.name}
            productDescription={item.description}
            productImage={item.imagesPath[0]}
            userImage={item.user.image}
            userName={item.user.name}
            postDate={item.createdAt}
            offersCount={2}
            footerSetup={itemDetailFooterSetup}
          />
      ))}

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default ItemList;
