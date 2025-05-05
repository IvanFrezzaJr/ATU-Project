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
  