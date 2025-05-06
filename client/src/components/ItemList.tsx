import ItemDetailCard from './ItemDetailCard';
import Pagination from './Pagination';
import { UserItemResponse, ItemDetailFooterSetup } from '../types/item';
import { PageType } from '../types/page';
import { useAuth } from '../context/AuthContext';



interface ItemListProps {
  items: UserItemResponse[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  page: PageType;
  item?: UserItemResponse;
}

const ItemList = ({ items, currentPage, totalPages, onPageChange, page, item }: ItemListProps) => {

  const { token } = useAuth();

  const itemDetailFooterSetup: ItemDetailFooterSetup = {
    userInfo: { show: true },
    actionMenu: { show: token ? true : false  },
    page,
    item,
  };

  return (
    <div>
      {items.map((item) => (
        <ItemDetailCard
          key={item.id}
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
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
};

export default ItemList;
