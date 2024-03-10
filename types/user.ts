import { Categories } from "./categories";

export interface ResponseUser {
  ok: boolean;
  error?: string;
  createdUser?: User;
}

export interface User {
  email: string;
  id: string;
  name: string;
  image: string;
  signupDate: string;
  updatedAt: string;
  categories: Categories;
  transactionsDate?: {
    from: string; // Date in format yyyy-MM-dd
    to: string; // Date in format yyyy-MM-dd
  };
}
