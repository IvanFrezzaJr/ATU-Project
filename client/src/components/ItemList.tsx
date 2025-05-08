import ItemDetailCard from './ItemDetailCard';
import Pagination from './Pagination';
import { UserItemResponse, ItemDetailFooterSetup, AuthUser } from '../types/item';
import { PageType } from '../types/page';
import { useAuth } from '../context/AuthContext';



interface ItemListProps {
  user?: AuthUser | null;
  items: UserItemResponse[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  page: PageType;
  item?: UserItemResponse;
}

const ItemList = ({ items, currentPage, totalPages, onPageChange, page, item }: ItemListProps) => {

  const { token, user } = useAuth();

  const itemDetailMakeOffer: ItemDetailFooterSetup = {
    userInfo: { show: true },
    actionMenu: { show: token ? true : false  },
    page,
    item,
  };

  const itemDetailOwner: ItemDetailFooterSetup = {
    userInfo: { show: true },
    actionMenu: { show: false  },
    page,
    item,
  };


  return (
    <div>
      {items.map((item) => {
        const isOwner = item.user.id === parseInt(user?.id ?? "");
  
        const footerSetup =
          page === PageType.Items
            ? isOwner
              ? itemDetailOwner
              : itemDetailMakeOffer
            : isOwner
              ? itemDetailMakeOffer
              : itemDetailOwner;
  
        return (
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
            footerSetup={footerSetup}
          />
        );
      })}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
  
};

export default ItemList;
