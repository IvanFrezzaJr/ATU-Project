import {UserItemResponse, PaginationResult, ItemStatus} from '../types/item';

  
  let offersData: UserItemResponse[] = [
    {
        id: 1,
        name: "Product 1",
        description: "Product 1",
        quantity: 1,
        status: ItemStatus.InOffer,
        imagesPath: ["https://placehold.co/40x40"],
        createdAt: new Date("2025-03-25"),
        updatedAt: new Date("2025-03-25"),
        user: {
            id: 1,
            name: "Ivan Frezza",
            image: "https://placehold.co/40x40",
            email: "ivan1@email.com",
            password: "senha123", // simulado
            street: "Rua das Flores, 123",
            city: "São Paulo",
            state: "SP",
            postalcode: "01234-567",
            country: "Brasil",
            createdAt: new Date("2025-03-25"),
            updatedAt: new Date("2025-03-25"),
        },
    },
    {
        id: 2,
        name: "Product 2",
        description: "Product 2",
        quantity: 1,
        status: ItemStatus.OfferAgreed,
        imagesPath: ["https://placehold.co/40x40"],
        createdAt: new Date("2025-03-25"),
        updatedAt: new Date("2025-03-25"),
        user: {
            id: 1,
            name: "Ivan Frezza",
            image: "https://placehold.co/40x40",
            email: "ivan1@email.com",
            password: "senha123",
            street: "Rua das Flores, 123",
            city: "São Paulo",
            state: "SP",
            postalcode: "01234-567",
            country: "Brasil",
            createdAt: new Date("2025-03-25"),
            updatedAt: new Date("2025-03-25"),
        },
    },
    {
        id: 3,
        name: "Product 3",
        description: "Product 3",
        quantity: 1,
        status: ItemStatus.NotListed,
        imagesPath: ["https://placehold.co/40x40"],
        createdAt: new Date("2025-03-25"),
        updatedAt: new Date("2025-03-25"),
        user: {
            id: 2,
            name: "Maria Oliveira",
            image: "https://placehold.co/40x40",
            email: "maria@email.com",
            password: "senha123", // simulado
            street: "Rua das Palmeiras, 456",
            city: "Rio de Janeiro",
            state: "RJ",
            postalcode: "02345-678",
            country: "Brasil",
            createdAt: new Date("2025-03-25"),
            updatedAt: new Date("2025-03-25"),
        },
    },
    {
        id: 4,
        name: "Product 4",
        description: "Product 4",
        quantity: 1,
        status: ItemStatus.NotListed,
        imagesPath: ["https://placehold.co/40x40"],
        createdAt: new Date("2025-03-25"),
        updatedAt: new Date("2025-03-25"),
        user: {
            id: 2,
            name: "Maria Oliveira",
            image: "https://placehold.co/40x40",
            email: "maria@email.com",
            password: "senha123", // simulado
            street: "Rua das Palmeiras, 456",
            city: "Rio de Janeiro",
            state: "RJ",
            postalcode: "02345-678",
            country: "Brasil",
            createdAt: new Date("2025-03-25"),
            updatedAt: new Date("2025-03-25"),
        },
    },
    {
        id: 5,
        name: "Product 5",
        description: "Product 5",
        quantity: 1,
        status: ItemStatus.NotListed,
        imagesPath: ["https://placehold.co/40x40"],
        createdAt: new Date("2025-03-25"),
        updatedAt: new Date("2025-03-25"),
        user: {
            id: 2,
            name: "Maria Oliveira",
            image: "https://placehold.co/40x40",
            email: "maria@email.com",
            password: "senha123", // simulado
            street: "Rua das Palmeiras, 456",
            city: "Rio de Janeiro",
            state: "RJ",
            postalcode: "02345-678",
            country: "Brasil",
            createdAt: new Date("2025-03-25"),
            updatedAt: new Date("2025-03-25"),
        },
    },
  ];
  
  // Simulate auto-incrementing ID
  let nextId = offersData.length + 1;
  
  const itemService = {
    getAll(): UserItemResponse[] {
      return offersData;
    },
  
    getById(id: number): UserItemResponse | undefined {
      return offersData.find(item => item.id === id);
    },
  
    create(item: Omit<UserItemResponse, "id" | "createdAt" | "updatedAt">): UserItemResponse {
      const newItem: UserItemResponse = {
        ...item,
        id: nextId++,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      offersData.push(newItem);
      return newItem;
    },
  
    update(id: number, updatedItem: Partial<Omit<UserItemResponse, "id">>): UserItemResponse | null {
      const index = offersData.findIndex(item => item.id === id);
      if (index === -1) return null;
  
      offersData[index] = {
        ...offersData[index],
        ...updatedItem,
        updatedAt: new Date(),
      };
      return offersData[index];
    },
  
    delete(id: number): boolean {
      const originalLength = offersData.length;
      offersData = offersData.filter(item => item.id !== id);
      return offersData.length < originalLength;
    },
  
    getPaginated(page: number = 1, itemsPerPage: number = 2): PaginationResult<UserItemResponse> {
      const totalItems = offersData.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
  
      return {
        data: offersData.slice(start, end),
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage,
      };
    },
  };
  
  export default itemService;
  