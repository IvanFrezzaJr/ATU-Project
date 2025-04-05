import styles from "../styles/ItemDetail.module.css";
import { ItemDetailFooterSetup } from "../types/item";
import { PageType } from "../types/page";
import { useCustomButtonBehavior } from "../hooks/useCustomButtonBehavior";

type ButtonActionType = "navigate" | "alert" | "custom";


interface ItemDetailProps {
    productId: number;
    productName: string;
    productDescription: string;
    productImage: string;
    userImage: string;
    userName: string;
    postDate: Date;
    offersCount: number;
    footerSetup?: ItemDetailFooterSetup;
    buttonActionType?: ButtonActionType;
    customButtonAction?: () => void;
}


interface CustomButtonProps {
    page: PageType;
    id?: number;
}


const CustomButton = (customButtonProps: CustomButtonProps) => {
    switch (customButtonProps.page) {
        case PageType.Offers:
            return (
                <button
                    onClick={useCustomButtonBehavior(PageType.Trade, { id: customButtonProps.id ?? 0 })}>
                    Make a offer
                </button>
            )
        case PageType.Trade:
            return (
                <button
                    onClick={useCustomButtonBehavior(PageType.Confirm)}>
                    Trade
                </button>
            )

        default:
            break;
    }
}


const ItemDetail = (itemDetailProps: ItemDetailProps) => {

    const footerSetup = itemDetailProps.footerSetup;


    return (
        <article>

            <div className={styles['item-info']}>
                <div>
                    <img src={itemDetailProps.productImage} alt="Product Image" />
                </div>
                <div>
                    <div>
                        <h4>{itemDetailProps.productName}</h4>
                        <p>{itemDetailProps.productDescription}</p>
                    </div>
                </div>
            </div>

            <div className={`grid ${styles["footer"]}`}>
                {footerSetup?.userInfo?.show &&
                    <div className={styles['user-info']}>
                        <div>
                            <img src={itemDetailProps.userImage} alt="User Image" />
                        </div>
                        <div className={styles['user-info-text']}>
                            <small><strong>{itemDetailProps.userName}</strong></small>
                            <small>Posted on: {itemDetailProps.postDate.toLocaleDateString()}</small>
                        </div>
                    </div>
                }

                {footerSetup?.actionMenu?.show &&
                    <div className={styles['offer-info']}>
                        <CustomButton page={footerSetup?.page} id={itemDetailProps.productId} />
                        <small>These goods have <strong>{itemDetailProps.offersCount}</strong> offers</small>
                    </div>
                }
            </div>

        </article>
    );
};

export default ItemDetail;
