import { User } from "./user";

export interface Category {
  id: number | string;
  name: string;
  newEntry?: boolean;
}

export interface TransactionObj {
  name: string;
  amount: number;
  date: string;
  categories: Category[];
  notes?: string;
}

export type TransactionObjBack = TransactionObj & {
  userId: string;
  createdAt: string;
  updatedAt: string;
  id: string;
};

export interface ResponseTransaction {
  ok: boolean;
  error?: string;
  insertedTransactions?: TransactionObjBack[];
  updatedUser?: User[];
}

export interface ResponseTransactionBulk {
  ok: boolean;
  error?: string;
  insertedTransactions?: number;
  updatedUser?: User[];
}

export interface TransactionBulk {
  Date: string;
  Concept: string;
  Amount: string;
  Notes?: string;
}

export interface ResponseFile {
  ok: boolean;
  data?: TransactionBulk[];
  error?: string;
}
