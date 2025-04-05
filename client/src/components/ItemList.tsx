import ItemDetail from './ItemDetail';
import Pagination from './Pagination';
import { ItemResponsePaginated, PaginationResult } from '../types/item';
import itemService from "../services/itemService";
import { useEffect, useState } from 'preact/hooks';

const ItemList = () => {
  const [items, setItems] = useState<ItemResponsePaginated[]>([]);
  const [pagination, setPagination] = useState<PaginationResult<ItemResponsePaginated> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    const result = itemService.getPaginated(currentPage, itemsPerPage);
    setItems(result.data);
    setPagination(result);
  }, [currentPage, itemsPerPage]);

  if (!pagination) return <p>Loading...</p>;

  return (
    <div>
      {items.map((item: ItemResponsePaginated) => (
        <ItemDetail
          key={item.id}
          productName={item.name}
          productDescription={item.description}
          productImage={item.imagesPath[0]}
          userImage={item.user.image}
          userName={item.user.name}
          postDate={item.createdAt}
          offersCount={2}
          showFooter={true}
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
