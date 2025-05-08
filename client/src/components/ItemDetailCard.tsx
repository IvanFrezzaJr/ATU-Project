import styles from "../styles/ItemDetail.module.css";
import { ItemDetailFooterSetup, ItemStatus, TradeType } from "../types/item";
import { PageType } from "../types/page";
import { useLocation } from "wouter-preact";
import { useCallback } from "react";
import itemPlaceholder from '../assets/logo.svg';
import profilePlaceholder from '../assets/profile-placeholder.png';
import { format } from 'date-fns';
import { enIE } from 'date-fns/locale';
import { getStatusDisplay } from "../utils/statusUtils";
import { getTradeTypeDisplay } from "../utils/tradeUtils";

const apiUrl = import.meta.env.VITE_API_URL;



type ButtonActionType = "navigate" | "alert" | "custom";

interface ItemDetailProps {
    productId: number;
    productName: string;
    productDescription: string;
    productImage: string;
    userImage: string;
    userName: string;
    postDate: Date;
    quantity: number;
    status: ItemStatus;
    tradeType: TradeType;
    footerSetup?: ItemDetailFooterSetup;
    buttonActionType?: ButtonActionType;
    customButtonAction?: () => void;
}

interface CustomButtonProps {
    page: PageType;
    id?: number;
    offer_id?: number;
    customAction?: () => void;
}

// Factory function that returns the appropriate button action (decoupled from the component)
function createButtonAction(
    pageType: PageType,
    navigate: (to: string) => void,
    params?: { id: number; offer_id?: number }
): () => void {

    console.log(PageType.Items);

    switch (pageType) {
        case PageType.Items:
            return () => navigate(`/offers/${params?.id ?? 0}`);
        case PageType.Offers:
            return () => navigate(`/trade/${params?.id ?? 0}/to/${params?.offer_id ?? 0}`);
        default:
            return () => navigate("/");
    }
}


const CustomButton = ({ page, id, offer_id, customAction }: CustomButtonProps) => {
    const [, navigate] = useLocation();

    const handleClick = useCallback(() => {
        if (customAction) {
            customAction(); // Use custom action if provided
        } else {
            const action = createButtonAction(page, navigate, { id: id ?? 0, offer_id });
            action(); // Use default behavior based on page type
        }
    }, [customAction, page, id, offer_id, navigate]);

    // Button text based on page context
    let buttonText: string;

    switch (page) {
      case PageType.Items:
        buttonText = "Make an offer";
        break;
      case PageType.Offers:
        buttonText = "Trade";
        break;
      case PageType.Trade:
        buttonText = "Continue";
        break;
      default:
        buttonText = "Go";
    }

    return <button onClick={handleClick}>{buttonText}</button>;
};

// Main component that renders the item details and footer section
const ItemDetailCard = ({
    productId,
    productName,
    productDescription,
    productImage,
    userImage,
    userName,
    postDate,
    quantity,
    status,
    tradeType,
    footerSetup,
    buttonActionType,
    customButtonAction,
}: ItemDetailProps) => {

    const { label, style } = getStatusDisplay(status);
    const { label: tradeLabel, style: tradeStyle } = getTradeTypeDisplay(tradeType);


    return (
        <article>
            {/* Item main info */}
            <div className={styles["item-info"]}>
                <div>
                    <img src={productImage ? `${apiUrl}${productImage}` : itemPlaceholder} width="40" height="40" alt="Product Image" />

                </div>
                <div>
                    <div>
                        <h4>{productName}</h4>
                        <p>{productDescription}</p>
                    </div>
                </div>
            </div>

            {/* Footer section (user info and actions) */}
            <div className={`grid ${styles["footer"]}`}>
                {/* Optional user info */}
                {footerSetup?.userInfo?.show && (
                    <div className={styles["user-info"]}>
                        <div>
                            <img src={ userImage ? `${apiUrl}${userImage}`: profilePlaceholder} alt="User Image" />
                        </div>
                        <div className={styles["user-info-text"]}>
                            <small>
                                <strong>{userName}</strong>
                            </small>
                            <small>Posted on: {format(postDate, "dd/MM/yyyy HH:mm", { locale: enIE })}</small>
                        </div>
                    </div>
                )}

                {/* Optional action menu with button */}

                    <div className={styles["offer-info"]}>
                    {footerSetup?.actionMenu?.show && (
                        <CustomButton
                            page={footerSetup.page}
                            id={productId}
                            offer_id={footerSetup.item?.id}
                            customAction={buttonActionType === "custom" ? customButtonAction : undefined}
                        />
                    )}
                        <small>Quantity: <strong>{quantity}</strong> offers
                        </small>
                         <small>
                            Status: <strong style={style}>{label}</strong> offers
                        </small>
                        <small>
                            Trade type: <strong style={tradeStyle}>{tradeLabel}</strong>
                        </small>
                    </div>
                
            </div>
        </article>
    );
};

export default ItemDetailCard;
