
export interface User {
    id: number;
    name: string;
    image: string;
    email: string;
    password: string;
    street: string;
    city: string;
    state: string;
    postalcode: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
}