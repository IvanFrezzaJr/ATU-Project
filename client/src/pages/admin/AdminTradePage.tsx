import { useEffect, useState } from "preact/hooks";
import { useLocation } from "wouter-preact";
import { useAuth } from "../../context/AuthContext";
import { TradeResponse } from "../../types/trade";
import { GlobalMessage } from '../../components/GlobalMessage';
import { getPaginatedTradesOfferFrom, getPaginatedTradesOfferTo, getPaginatedHistory, acceptTrade, rejectTrade } from "../../services/tradeService";


import AcceptIcon from '@mui/icons-material/PublishedWithChanges';
import RejectedIcon from '@mui/icons-material/Unpublished';

import styles from "../../styles/Grid.module.css";

const AdminTradePage = () => {
    const [tradesFrom, setFromTrades] = useState<TradeResponse[]>([]);
    const [tradesTo, setToTrades] = useState<TradeResponse[]>([]);
    const [tradesHistory, setToHistory] = useState<TradeResponse[]>([]);
    const [currentPage,] = useState(1);
    const [, setFromTotalPages] = useState(1);
    const [, setToTotalPages] = useState(1);
    const [, setHistoryTotalPages] = useState(1);
    const itemsPerPage = 10;
    const [globalMessage, setGlobalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    

    const { token, user } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (!token) {
            setLocation("/");
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            loadTrades();
        }
    }, [token, currentPage]);

    const loadTrades = async () => {
        try {
            const [fromResult, toResult, historyResult] = await Promise.all([
                getPaginatedTradesOfferFrom({
                    page: currentPage,
                    itemsPerPage,
                    token,
                    userId: user ? parseInt(user.id) : null,
                }),
                getPaginatedTradesOfferTo({
                    page: currentPage,
                    itemsPerPage,
                    token,
                    userId: user ? parseInt(user.id) : null,
                }),

                getPaginatedHistory({
                    page: currentPage,
                    itemsPerPage,
                    token,
                    userId: user ? parseInt(user.id) : null,
                }),

                

            ]);
    
            setFromTrades(fromResult.data);
            setFromTotalPages(fromResult.totalPages);
    
            setToTrades(toResult.data);
            setToTotalPages(toResult.totalPages);

            setToHistory(historyResult.data);
            setHistoryTotalPages(historyResult.totalPages);

        } catch (error) {
            console.error("Error fetching exchanges:", error);
        }
    };
    


    const handleAccept = async (tradeId: number) => {

        if (!token) return;

        try {
            await acceptTrade(tradeId, token);
            setGlobalMessage({ type: 'success', text: `Trade ${tradeId} accepted successfully` });
            await loadTrades();
        } catch (error) {
            if (error instanceof Error) {
                setGlobalMessage({ type: 'error', text: error.message});
            } else {
                setGlobalMessage({ type: 'error', text: "Unexpected error. Contact the system admin."});
            }
        }
    };
    
    
    const handleReject = async (tradeId: number) => {

        if (!token) return;

        try {
            await rejectTrade(tradeId, token);
            setGlobalMessage({ type: 'success', text: `Trade ${tradeId} successfully rejected` });
            await loadTrades();
        } catch (error) {
            if (error instanceof Error) {
                setGlobalMessage({ type: 'error', text: error.message});
            } else {
                setGlobalMessage({ type: 'error', text: "Unexpected error. Contact the system admin."});
            }
        }
    };

    return (
        <>
            <main>
                <div class={styles.content}>
                    {globalMessage && (
                    <GlobalMessage
                        type={globalMessage.type}
                        message={globalMessage.text}
                        onClose={() => setGlobalMessage(null)}
                    />
                    )}                        

                    <div className={styles.title + " margin-bottom"}>
                        <h2>Trade Page</h2>
                    </div>
                    <div className={styles.grid}>
                        <h3 className={styles.subtitle}>Exchange proposals made</h3>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Your Item</th>
                                        <th>Trade for</th>
                                        <th>Owner</th>
                                        <th>Trade Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tradesTo && tradesTo.length > 0 ? tradesTo.map((trade) => (
                                        <tr key={trade.id}>
                                            <td>{trade.id}</td>
                                            <td>{trade.userItemTo.name}</td>
                                            <td>{trade.userItemFrom.name}</td>
                                            <td>{trade.userItemFrom.user.name}</td>
                                            <td>{new Date(trade.tradeDate).toLocaleString()}</td>
                                            <td>{trade.tradeStatus}</td>
                                        </tr>
                                    )) :
                                    <div> No records found</div>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.footerPagination}>
                            <small>Showing {tradesTo.length} entries</small>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <h3>Exchange proposals received</h3>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Trade Item</th>
                                        <th>Trade for</th>
                                        <th>Owner</th>
                                        <th>Trade Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tradesFrom.map((trade) => (
                                        <tr key={trade.id}>
                                            <td>{trade.id}</td>
                                            <td>{trade.userItemFrom.name}</td>
                                            <td>{trade.userItemTo.name}</td>
                                            <td>{trade.userItemTo.user.name}</td>
                                            <td>{new Date(trade.tradeDate).toLocaleString()}</td>
                                            <td>{trade.tradeStatus}</td>
                                            <td class="actions">
                                                <span class="material-icons" onClick={() => handleAccept(trade.id)} style={{ cursor: "pointer" }}>
                                                    <AcceptIcon />
                                                </span>
                                                <span class="material-icons" onClick={() => handleReject(trade.id)} style={{ cursor: "pointer" }}>
                                                    <RejectedIcon />
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.footerPagination}>
                            <small>Showing {tradesFrom.length} entries</small>
                        </div>
                    </div>


                    <div className={styles.grid}>
                        <h3>Exchange History</h3>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Item</th>
                                        <th>Owner</th>
                                        <th>To</th>
                                        <th>Owner</th>
                                        <th>Trade Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tradesHistory.map((trade) => (
                                        <tr key={trade.id}>
                                            <td>{trade.id}</td>
                                            <td>{trade.userItemFrom.name}</td>
                                            <td>{trade.userItemTo.user.name}</td>
                                            <td>{trade.userItemTo.name}</td>
                                            <td>{trade.userItemFrom.user.name}</td>
                                            <td>{new Date(trade.tradeDate).toLocaleString()}</td>
                                            <td>{trade.tradeStatus}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.footerPagination}>
                            <small>Showing {tradesHistory.length} entries</small>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
};

export default AdminTradePage;