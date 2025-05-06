
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    image: string;
    street: string;
    city: string;
    state: string;
    postalcode: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface UserLogin {
    name: string;
    profilePic: string;
  }

export interface UserUpdate {
    name?: string;
    email?: string;
    password?: string;
    image?: string;
    street?: string;
    city?: string;
    state?: string;
    postalcode?: string;
    country?: string;
}
 