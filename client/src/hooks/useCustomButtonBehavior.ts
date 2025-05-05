// src/hooks/useCustomButtonBehavior.ts

import { useLocation } from "wouter-preact";
import { PageType } from "../types/page";


interface Params {
  id: number;
  offer_id?: number;
}

export function useCustomButtonBehavior(pageType: PageType, params?: Params): () => void {

  const [, navigate] = useLocation();


  switch (pageType) {
    case 'items':
      return () => {
        navigate("/items");
      };
    case 'trade':
      if (params && params.offer_id) {
        return () => {
          navigate(`/trade/${params.id}/to/${params.offer_id}`);
        };
      }
      return () => {
        navigate("/");
      };
    case 'offers':
      if (params) {
        return () => {
          navigate(`/offers/${params.id}`);
        };
      }
      return () => {
        navigate("/");
      };
    default:
      return () => {
        navigate("/");
      };
  }
}
