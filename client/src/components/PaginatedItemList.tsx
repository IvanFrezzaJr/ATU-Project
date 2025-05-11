// components/PaginatedItemList.tsx

import { useEffect, useState } from 'preact/hooks';
import ItemDetailCard from './ItemDetailCard';
import Pagination from './Pagination';
import { useAuth } from '../context/AuthContext';
import {
  PaginationResult,
  UserItemResponse,
  ItemDetailFooterSetup,
} from '../types/item';
import { PageType } from '../types/page';

interface FetchParams {
  page: number;
  itemsPerPage: number;
  token: string;
}

interface PaginatedItemListProps {
  fetchFn: (params: FetchParams) => Promise<PaginationResult<UserItemResponse>>;
  pageType: PageType;
  item?: UserItemResponse;
  itemsPerPage?: number;
}

const PaginatedItemList = ({
  fetchFn,
  pageType,
  item,
  itemsPerPage = 2,
}: PaginatedItemListProps) => {
  const [items, setItems] = useState<UserItemResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationResult<UserItemResponse> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const result = await fetchFn({ page: currentPage, itemsPerPage, token });
        setItems(result.data);
        setPagination(result);
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
      }
    };

    fetchData();
  }, [currentPage, fetchFn, itemsPerPage, token]);

  const itemDetailFooterSetup: ItemDetailFooterSetup = {
    userInfo: {
      show: true,
    },
    actionMenu: {
      show: true,
    },
    page: pageType,
    item,
  };

  if (!pagination) return <p>Loading...</p>;

  return (
    <div>
      {items.map((item: UserItemResponse) => (
        <ItemDetailCard
          key={item.id}
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

export default PaginatedItemList;
