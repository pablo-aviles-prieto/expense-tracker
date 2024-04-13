import { IUser } from "@/models";
import { Categories } from "./categories";

export interface ResponseUser {
  ok: boolean;
  error?: string;
  createdUser?: User;
}

export interface ResponseRegisterMail {
  ok: boolean;
  error?: string;
  message?: string;
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

export interface ResetPasswordResponse {
  ok: boolean;
  error?: string;
  message?: string;
}

export interface UpdateUserPreferencesResponse {
  ok: boolean;
  updatedUser?: IUser;
  error?: string;
  message?: string;
}

export interface ChangeEmailResponse {
  ok: boolean;
  message?: string;
  error?: string;
}
