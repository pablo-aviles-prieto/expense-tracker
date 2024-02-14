export const COMMON_CATEGORIES = [
  { id: 1, name: "Groceries" },
  { id: 2, name: "Rent" },
  { id: 3, name: "Transportation" },
  { id: 4, name: "Entertainment" },
  { id: 5, name: "Travel" },
  { id: 6, name: "Shopping" },
  { id: 7, name: "Gifts" },
];

export const authProviders = {
  google: "google",
} as const;

export const DEFAULT_CALLBACK_URL = "/dashboard";

export const errorMessages = {
  authorizedResource: "Not Authorized for this resource",
  createUser: "Error creating the user",
  credentials: "Check the credentials provided",
  emailRegistered: "Email already registered",
  generic: "Something went wrong. Try again later",
  invalidUserId: "Invalid user ID",
  methodAllowed: "Method Not Allowed",
  missingData: "There is missing data in the request",
  parsingImg: "Unable to parse the image",
  relogAcc: "Something happened, please relog into your account",
  gettingCategories: "Error getting the categories",
  addingTransaction: "Error adding the transaction to database",
  fileParsing: "File processing failed. Try again later",
  fileType: "Wrong file type. Only CSV is allowed",
  dateFormatCSV: "Please, select the correct date format used on your CSV file",
} as const;

export const dateFormat = {
  ISO: "yyyy-MM-dd",
  US: "MM/dd/yyyy",
  EU: "dd/MM/yyyy",
  monthYear: "yyyy-MM",
  shortMonth: "MMM",
  shortMonthWithYear: "MMM yy",
} as const;

export const getEllipsed = "overflow-hidden text-ellipsis whitespace-nowrap";

export const monthOrder = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
} as const;
