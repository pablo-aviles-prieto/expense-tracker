import mongoose from 'mongoose';

import type { EnhancedCategory } from './categories';
import type { User } from './user';

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

export interface TransactionBulk {
  id: number;
  Date: string;
  Concept: string;
  Amount: string;
  Notes?: string;
  selectedCategories?: EnhancedCategory[];
}

export interface ResponseFile {
  ok: boolean;
  data?: TransactionBulk[];
  error?: string;
}

export interface ResponseFileHeaders {
  ok: boolean;
  headers?: string[];
  error?: string;
}

export interface TransactionEndpointBody {
  name: string;
  amount: number;
  date: string;
  selectedCategories: Category[];
  notes?: string;
}

export interface TransactionBulkResponse {
  ok: boolean;
  error?: string;
  insertedTransactions?: number;
  updatedUser?: User;
}

export interface TransactionDeleteReponse {
  ok: boolean;
  error?: string;
  result?: mongoose.mongo.DeleteResult;
  deletedCount?: number;
}

export interface TransactionUpdateReponse {
  ok: boolean;
  error?: string;
  data?: TransactionObjBack;
}

export interface TransactionCreateReponse {
  ok: boolean;
  error?: string;
  data?: TransactionObjBack;
}
