import { useEffect, useState } from "preact/hooks";
import { Grid } from "../components/Grid";
import itemService from "../services/itemService";
import { PaginationResult, UserItemResponse } from "../types/item";

const ItemPage = () => {
    const [items, setItems] = useState<UserItemResponse[]>([]);
    const [, setPagination] = useState<PaginationResult<UserItemResponse> | null>(null);
    const [currentPage, ] = useState(1);
    const itemsPerPage = 2;

  useEffect(() => {
    const result = itemService.getPaginated(currentPage, itemsPerPage);
    setItems(result.data);
    setPagination(result);
  }, [currentPage, itemsPerPage]);

  return (
    <>
          <Grid title="Items" data={items}/>
    </>    
  );
};

export default ItemPage;
