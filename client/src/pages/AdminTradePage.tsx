import { useEffect, useState } from "preact/hooks";
import { useLocation } from "wouter-preact";
import { useAuth } from "../context/AuthContext";
import { TradeResponse, PaginationResult } from "../types/trade";
import { getPaginatedTrades } from "../services/tradeService";

import AcceptIcon from '@mui/icons-material/PublishedWithChanges';

import styles from "../styles/Grid.module.css";

const AdminTradePage = () => {
    const [trades, setTrades] = useState<TradeResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const { token } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (!token) {
            setLocation("/");
        }
    }, [token]);

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const result: PaginationResult<TradeResponse> = await getPaginatedTrades({
                    page: currentPage,
                    itemsPerPage,
                    token,
                });
                setTrades(result.data);
                setTotalPages(result.totalPages);
            } catch (error) {
                console.error("Erro ao buscar trocas:", error);
            }
        };

        fetchTrades();

    }, [currentPage]);

    return (
        <div>
            <Grid title="Admin Trades" data={trades} />
        </div>
    );
};

interface GridProps {
    title: string;
    data: TradeResponse[];
}

const Grid = ({ title, data }: GridProps) => {

    const [, setLocation] = useLocation();

  
    return (
    <>
        <div className={styles.searchPagination}>
            <h2>{title}</h2>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Your item</th>
                        <th>Trade for</th>
                        <th>Trade Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((trade) => (
                        <tr key={trade.id}>
                            <td>{trade.id}</td>
                            <td>{trade.user_item_from.name}</td>
                            <td>{trade.user_item_to.name}</td>
                            <td>{new Date(trade.trade_date).toLocaleString()}</td>
                            <td>{trade.trade_status}</td>
                            <td class="actions">
                            <span class="material-icons" onClick={() => setLocation(`/accept/${1}`)} style={{ cursor: "pointer" }}>
                                <AcceptIcon />
                            </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className={styles.footerPagination}>
            <small>Showing {data.length} entries</small>
        </div>
    </>
    
)};

export default AdminTradePage;