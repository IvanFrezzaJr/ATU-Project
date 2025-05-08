import { ItemStatus } from '../types/item';

interface StatusDisplay {
  label: string;
  style: React.CSSProperties;
}

export const getStatusDisplay = (status: ItemStatus): StatusDisplay => {
  switch (status) {
    case ItemStatus.OfferAgreed:
      return { label: "Offer agreed", style: { color: "green", fontWeight: "bold" } };
    case ItemStatus.InOffer:
      return { label: "In offer", style: { color: "orange", fontWeight: "bold" } };
    case ItemStatus.NotListed:
      return { label: "Not listed", style: { color: "gray", fontWeight: "bold" } };
    default:
      return { label: "Unknown", style: { color: "red", fontWeight: "bold" } };
  }
};
