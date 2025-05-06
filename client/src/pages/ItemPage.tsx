// src/pages/ItemPage.tsx

import { useEffect, useState } from "preact/hooks";
import { getPaginatedItems } from "../services/itemService";
import { PaginationResult, UserItemResponse } from "../types/item";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "wouter-preact";

// Ícones do MUI
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/AddCircle';

// Estilos
import styles from '../styles/Grid.module.css';

const ItemPage = () => {
  const [items, setItems] = useState<UserItemResponse[]>([]);
  const [, setLocation] = useLocation();
  const [, setPagination] = useState<PaginationResult<UserItemResponse> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setLocation('/');
    }
  }, [token]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const result = await getPaginatedItems({
          page: currentPage,
          itemsPerPage,
          onlyUserItems: true,
          token,
        });
        setItems(result.data);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Erro ao buscar ofertas:', error);
      }
    };

    fetchOffers();
  }, [currentPage]);

  return (
    <>
      <Grid title="Items" data={items} />
    </>
  );
};

interface GridProps {
  title: string;
  data: UserItemResponse[];
}

const Grid = ({ title, data }: GridProps) => {
  const [, setLocation] = useLocation();

  return (
    <>
      <div className={styles.searchPagination}>
        <h2>{title}</h2>
        
        <button onClick={() => setLocation("/items/new")}><CreateIcon /></button>

      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.status}</td>
                <td class="actions">
                  <span class="material-icons" onClick={() => setLocation(`/items/${item.id}`)} style={{ cursor: "pointer" }}>
                    <EditIcon />
                  </span>

                  <span class="material-icons"><a href="#"><DeleteIcon /></a></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.footerPagination}>
        <small>Showing 5 out of 25 entries</small>
        <nav>
          <ul>
            <li><a href="#"><small>&laquo;</small></a></li>
            <li><a href="#"><small>1</small></a></li>
            <li><a href="#"><small>2</small></a></li>
            <li><a href="#"><small>3</small></a></li>
            <li><a href="#"><small>&raquo;</small></a></li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default ItemPage;
