import { useLocation } from 'wouter-preact';
import Offer from './OfferDetail';
import Pagination from './Pagination';

const offersData = [
    { title: 'Offer Title 1', description: 'Description of the offer 1.', productName: 'Product 1', productDescription: 'Description of product 1.', productImage: 'https://placehold.co/40x40', userImage: 'https://placehold.co/40x40', userName: 'Ivan Frezza', postDate: 'March 25, 2025', offersCount: 5 },
    { title: 'Offer Title 2', description: 'Description of the offer 2.', productName: 'Product 2', productDescription: 'Description of product 2.', productImage: 'https://placehold.co/40x40', userImage: 'https://placehold.co/40x40', userName: 'Ivan Frezza', postDate: 'March 25, 2025', offersCount: 5 },
    { title: 'Offer Title 3', description: 'Description of the offer 3.', productName: 'Product 3', productDescription: 'Description of product 3.', productImage: 'https://placehold.co/40x40', userImage: 'https://placehold.co/40x40', userName: 'Ivan Frezza', postDate: 'March 25, 2025', offersCount: 5 },
    { title: 'Offer Title 4', description: 'Description of the offer 4.', productName: 'Product 4', productDescription: 'Description of product 4.', productImage: 'https://placehold.co/40x40', userImage: 'https://placehold.co/40x40', userName: 'Ivan Frezza', postDate: 'March 25, 2025', offersCount: 5 },
    { title: 'Offer Title 5', description: 'Description of the offer 5.', productName: 'Product 5', productDescription: 'Description of product 5.', productImage: 'https://placehold.co/40x40', userImage: 'https://placehold.co/40x40', userName: 'Ivan Frezza', postDate: 'March 25, 2025', offersCount: 5 },
    { title: 'Offer Title 6', description: 'Description of the offer 6.', productName: 'Product 6', productDescription: 'Description of product 6.', productImage: 'https://placehold.co/40x40', userImage: 'https://placehold.co/40x40', userName: 'Ivan Frezza', postDate: 'March 25, 2025', offersCount: 5 },
    // Add more offers as needed
];

const OFFERS_PER_PAGE = 3; // Number of offers per page

const OfferList = () => {
    const [location] = useLocation();

    // Criar um objeto URLSearchParams baseado na URL atual
    const searchParams = new URLSearchParams(location.split('?')[1]); // Pegamos a parte após o `?`
    
    // Extrair o parâmetro "page" e convertê-lo para número, com fallback para 1
    const currentPage = Number(searchParams.get('page')) || 1;

    // Calcular o total de páginas
    const totalPages = Math.ceil(offersData.length / OFFERS_PER_PAGE);

    // Pegar os itens corretos para a página atual
    const currentOffers = offersData.slice(
        (currentPage - 1) * OFFERS_PER_PAGE,
        currentPage * OFFERS_PER_PAGE
    );

    return (
        <div>
            {currentOffers.map((offer, index) => (
                <Offer
                    key={index}
                    title={offer.title}
                    description={offer.description}
                    productName={offer.productName}
                    productDescription={offer.productDescription}
                    productImage={offer.productImage}
                    userImage={offer.userImage}
                    userName={offer.userName}
                    postDate={offer.postDate}
                    offersCount={offer.offersCount}
                />
            ))}
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
    );
};

export default OfferList;
