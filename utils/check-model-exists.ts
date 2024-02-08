import { modelNames } from "mongoose";

export function modelExists(modelName: string): boolean {
  return modelNames().includes(modelName);
}
