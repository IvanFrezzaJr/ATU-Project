import styles from "../styles/Offer.module.css";

interface OfferProps {
    title: string;
    description: string;
    productName: string;
    productDescription: string;
    productImage: string;
    userImage: string;
    userName: string;
    postDate: string;
    offersCount: number;
}

const Offer = ({
    title,
    description,
    productName,
    productDescription,
    productImage,
    userImage,
    userName,
    postDate,
    offersCount,
}: OfferProps) => {
    return (
        <article>
            <div class="grid">
                <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </div>
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
            <div className={`grid ${styles["footer"]}`}>
                <div className={styles['user-info']}>
                    <div>
                        <img src={userImage} alt="User Image" />
                    </div>
                    <div className={styles['user-info-text']}>
                        <small><strong>{userName}</strong></small>
                        <small>Posted on: {postDate}</small>
                    </div>
                </div>
                <div className={styles['offer-info']}>
                    <button>Make an Offer</button>
                    <small>These goods have <strong>{offersCount}</strong> offers</small>
                </div>
            </div>
        </article>
    );
};

export default Offer;
