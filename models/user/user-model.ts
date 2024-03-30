import { Schema, model, Document, ObjectId, Model } from "mongoose";
import { modelExists } from "@/utils/check-model-exists";
import {
  BillingPeriod,
  SubscriptionStatus,
  type Subscription,
} from "@/types/subscriptions";

export interface IUser extends Document {
  _id: ObjectId;
  image?: string;
  name: string;
  email: string;
  password: string;
  signupDate: string;
  categories: ObjectId[];
  currency: string;
  dateFormat: string;
  subscriptions?: Subscription[];
  theme?: string;
  transactionsDate?: {
    from: string; // Date in format yyyy-MM-dd
    to: string; // Date in format yyyy-MM-dd
  };
}

const SubscriptionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  startDate: { type: String, required: true },
  billingPeriod: {
    type: String,
    required: true,
    enum: Object.values(BillingPeriod),
  },
  autoRenew: { type: Boolean, required: true },
  status: {
    type: String,
    required: true,
    enum: Object.values(SubscriptionStatus),
  },
  notes: String,
});

const UserSchema: Schema = new Schema({
  image: { type: String },
  name: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  signupDate: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: "categories" }],
  subscriptions: [SubscriptionSchema],
  currency: { type: String, required: true },
  dateFormat: { type: String, required: true },
  theme: { type: String },
  transactionsDate: {
    from: { type: String },
    to: { type: String },
  },
});

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc: Document, ret: Record<string, any>) => {
    if ("_id" in doc && "password" in doc) {
      delete ret._id;
      delete ret.password;
    }
  },
});

let UserModel: Model<IUser>;

if (modelExists("users")) {
  UserModel = model<IUser>("users");
} else {
  UserModel = model<IUser>("users", UserSchema);
}

export default UserModel;

// currency: To store the user's preferred currency for displaying expenses and incomes. This could be an ISO 4217 currency code, like "USD", "EUR", or "JPY".
// timezone: To store the user's timezone, which can be helpful for displaying date and time information correctly.
// dateFormat: To store the user's preferred date format, like "MM/DD/YYYY" or "DD/MM/YYYY".
// roles: If you plan to implement different access levels or roles within the application (e.g., admin, user, guest), storing roles in the user schema can help manage user permissions.
// notificationPreferences: User preferences for receiving notifications or reminders about important events, such as upcoming bills or recurring expenses.
// lastLogin: Timestamp of the user's last login, which can be useful for tracking user engagement or detecting inactive accounts.
