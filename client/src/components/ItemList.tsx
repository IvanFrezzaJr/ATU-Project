import ItemDetailCard from './ItemDetailCard';
import Pagination from './Pagination';
import { UserItemResponse, PaginationResult, ItemDetailFooterSetup } from '../types/item';
import itemService from "../services/itemService";
import { useEffect, useState } from 'preact/hooks';
import { PageType } from '../types/page';



interface ItemListProps {
  page: PageType;
  item?: UserItemResponse;
}

const ItemList = (itemListProps: ItemListProps) => {
  const [items, setItems] = useState<UserItemResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationResult<UserItemResponse> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;


  useEffect(() => {
    const result = itemService.getPaginated(currentPage, itemsPerPage);
    setItems(result.data);
    setPagination(result);
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
