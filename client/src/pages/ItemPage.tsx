import { useEffect, useState } from "preact/hooks";
import { Grid } from "../components/Grid";
import { getPaginatedItems } from "../services/itemService";
import { PaginationResult, UserItemResponse } from "../types/item";

const ItemPage = () => {
    const [items, setItems] = useState<UserItemResponse[]>([]);
    const [, setPagination] = useState<PaginationResult<UserItemResponse> | null>(null);
    const [currentPage, ] = useState(1);
    const itemsPerPage = 2;

    useEffect(() => {
      const fetchItems = async () => {
        try {
          const result = await getPaginatedItems(currentPage, itemsPerPage);
          setItems(result.data);
          setPagination(result);
        } catch (error) {
          console.error('Erro ao buscar itens:', error);
        }
      };
    
      fetchItems();
    }, [currentPage, itemsPerPage]);

  return (
    <>
          <Grid title="Items" data={items}/>
    </>    
  );
};

export default ItemPage;
