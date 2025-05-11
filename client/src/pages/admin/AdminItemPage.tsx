// src/pages/ItemPage.tsx

import { useEffect, useState } from "preact/hooks";
import { deleteItem, getPaginatedItems } from "../../services/itemService";
import { UserItemResponse } from "../../types/item";
import { GlobalMessage } from '../../components/GlobalMessage';
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "wouter-preact";

// Ícones do MUI
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/AddCircle';

// Estilos
import styles from '../../styles/Grid.module.css';
import { getTradeTypeDisplay } from "../../utils/tradeUtils";
import { getStatusDisplay } from "../../utils/statusUtils";
import Pagination from "../../components/Pagination";

const ItemPage = () => {
  const [items, setItems] = useState<UserItemResponse[]>([]);
  const [, setLocation] = useLocation();
  const [currentPage,setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [globalMessage, setGlobalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { token, user } = useAuth();



  useEffect(() => {
    if (!token) {
      setLocation('/');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadItems();
    }
}, [token, currentPage]);


  const loadItems = async () => {
    try {
      const result = await getPaginatedItems({
        page: currentPage,
        itemsPerPage,
        token,
        userId: user ? parseInt(user?.id) : null
      });

      setItems(result.data);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  
  const handleDelete = async (itemId: number) => {

      if (!token) return;

      try {
          await deleteItem(itemId, token);
          setGlobalMessage({ type: 'success', text: `Item ${itemId} successfully deleted` });
          await loadItems();
      } catch (error) {
          if (error instanceof Error) {
              setGlobalMessage({ type: 'error', text: error.message});
          } else {
              setGlobalMessage({ type: 'error', text: "Unexpected error. Contact the system admin."});
          }
      }
  };
  


  const handleEdit = async (itemId: number) => {
      if (!token) return;
      setLocation(`/items/${itemId}`)
  };


  const handleCreate = async () => {
    if (!token) return;
    
    setLocation("/items/new")
  }

  return (
    <main>
      <div class={styles.content}>
        {globalMessage && (
          <GlobalMessage
            type={globalMessage.type}
            message={globalMessage.text}
            onClose={() => setGlobalMessage(null)}
          />
        )}

        <div class="flex-between margin-bottom">
          <div className={styles.title}>
            <h2>Item Page</h2>
          </div>
          <button onClick={() => handleCreate()}><CreateIcon /> Create Item</button>
        </div>

        <div className={styles.grid}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Trade type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const { label, style } = getStatusDisplay(item.status);
                const { label: tradeLabel, style: tradeStyle } = getTradeTypeDisplay(item.tradeType);

                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td style={style}>{label}</td>
                    <td style={tradeStyle}>{tradeLabel}</td>
                    <td class="actions">
                      <span class="material-icons" onClick={() => handleEdit(item.id)} style={{ cursor: 'pointer' }}>
                        <EditIcon />
                      </span>

                      <span class="material-icons" onClick={() => handleDelete(item.id)} style={{ cursor: 'pointer' }}>
                        <DeleteIcon />
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className={styles.footerPagination}>
            <p>Showing {totalPages} out of {totalPages} entries</p>
          </div>
        </div>
       
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </main>
  );
};


export default ItemPage;
