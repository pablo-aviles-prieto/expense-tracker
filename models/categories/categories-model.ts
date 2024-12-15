/* eslint-disable max-len */
import { Document, model, Model, ObjectId, Schema } from 'mongoose';

import { modelExists } from '../../utils/check-model-exists'; // imported like this to make the seeder work

export interface ICategories extends Document {
  _id: ObjectId;
  name: string;
  common?: boolean;
}

const CategoriesSchema: Schema = new Schema({
  name: { type: String, required: true },
  common: Boolean,
});

CategoriesSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc: Document, ret: Record<string, unknown>) => {
    if ('name' in doc && '_id' in doc) {
      delete ret._id;
    }
  },
});

let CategoriesModel: Model<ICategories>;

if (modelExists('categories')) {
  CategoriesModel = model<ICategories>('categories');
} else {
  CategoriesModel = model<ICategories>('categories', CategoriesSchema);
}

export default CategoriesModel;
