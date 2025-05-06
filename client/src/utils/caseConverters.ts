// src/utils/caseConverters.ts

export const snakeToCamel = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(snakeToCamel);
    }
  
    if (obj !== null && typeof obj === 'object') {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        const camelKey = key.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
        acc[camelKey] = snakeToCamel(value);
        return acc;
      }, {} as any);
    }
  
    return obj;
  };
  

  export const camelToSnake = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(camelToSnake);
    }
  
    if (obj !== null && typeof obj === 'object') {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        acc[snakeKey] = camelToSnake(value);
        return acc;
      }, {} as any);
    }
  
    return obj;
  };