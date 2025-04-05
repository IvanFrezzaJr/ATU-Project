// src/hooks/useCustomButtonBehavior.ts

import { useLocation } from "wouter-preact";
import { PageType } from "../types/page";


interface Params{
  id: number;
}

export function useCustomButtonBehavior(pageType: PageType, params?:Params): () => void {

  const [, navigate] = useLocation();

  switch (pageType) {
    case 'offers':
      return () => {
        navigate("/offers");
      };
    case 'confirm':
      return () => {
        navigate("/confirm");
      };
    case 'trade':
      if (params){
        return () => {
          navigate(`/trade/${params.id}`);
        };
      }
      return () => {
        navigate("/trade");
      };
    default:
      return () => {
        navigate("/offers");
      };
  }
}
