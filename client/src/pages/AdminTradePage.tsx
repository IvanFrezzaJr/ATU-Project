import { useEffect, useState } from "preact/hooks";
import { useLocation } from "wouter-preact";
import { useAuth } from "../context/AuthContext";
import { TradeResponse } from "../types/trade";
import { getPaginatedTrades } from "../services/tradeService";

import AcceptIcon from '@mui/icons-material/PublishedWithChanges';

import styles from "../styles/Grid.module.css";

const AdminTradePage = () => {
    const [trades, setTrades] = useState<TradeResponse[]>([]);
    const [currentPage, ] = useState(1);
    const [, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const { token, user } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (!token) {
            setLocation("/");
        }
    }, [token]);

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const result = await getPaginatedTrades({
                    page: currentPage,
                    itemsPerPage,
                    token,
                    userId: user ? parseInt(user?.id) : null,
                    onlyOffer: true
                });
                console.log(result);
                setTrades(result.data);
                setTotalPages(result.totalPages);
            } catch (error) {
                console.error("Erro ao buscar trocas:", error);
            }
        };

        fetchTrades();

    }, [currentPage]);

    return (
        <>
        <div className={styles.searchPagination}>
            <h2>Trade Page</h2>
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
                    {trades.map((trade) => (
                        <tr key={trade.id}>
                            <td>{trade.id}</td>
                            <td>{trade.userItemFrom.name}</td>
                            <td>{trade.userItemTo.name}</td>
                            <td>{new Date(trade.tradeDate).toLocaleString()}</td>
                            <td>{trade.tradeStatus}</td>
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
            <small>Showing {trades.length} entries</small>
        </div>
    </>
    );
};

export default AdminTradePage;