import ActionButton from "./CustomButton";

import styles from "../styles/ItemDetail.module.css";



type ButtonActionType = "navigate" | "alert" | "custom";

interface OfferProps {
    productName: string;
    productDescription: string;
    productImage: string;
    userImage: string;
    userName: string;
    postDate: Date;
    offersCount: number;
    showFooter?: boolean;
    buttonActionType?: ButtonActionType;
    customButtonAction?: () => void; 
}

const ItemDetail = ({
    productName,
    productDescription,
    productImage,
    userImage,
    userName,   
    postDate,
    offersCount,
    showFooter=true
}: OfferProps) => {


    return (
        <article>

            <div className={styles['item-info']}>
                <div>
                    <img src={productImage} alt="Product Image" />
                </div>
                <div>
                    <div>
                        <h4>{productName}</h4>
                        <p>{productDescription}</p>
                    </div>
                </div>
            </div>

            { showFooter &&
                <div className={`grid ${styles["footer"]}`}>
                    <div className={styles['user-info']}>
                        <div>
                            <img src={userImage} alt="User Image" />
                        </div>
                        <div className={styles['user-info-text']}>
                            <small><strong>{userName}</strong></small>
                            <small>Posted on: {postDate.toLocaleDateString()}</small>
                        </div>
                    </div>
                    <div className={styles['offer-info']}>
                        <ActionButton 
                            actionType="tradelist" 
                            label="Make an Offer" 
                            customAction={() => console.log("Ação personalizada!")} 
                        />

                        <small>These goods have <strong>{offersCount}</strong> offers</small>
                    </div>
                </div>
            }
        </article>
    );
};

export default ItemDetail;
