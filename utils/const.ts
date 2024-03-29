export const authProviders = {
  google: "google",
} as const;

export const errorMessages = {
  authorizedResource: "Not Authorized for this resource",
  createUser: "Error creating the user",
  credentials: "Check the credentials provided",
  generic: "Something went wrong. Try again later",
  invalidUserId: "Invalid user ID",
  methodAllowed: "Method Not Allowed",
  missingData: "There is missing data in the request",
  parsingImg: "Unable to parse the image",
  relogAcc: "Something happened, please relog into your account",
  gettingCategories: "Error getting the categories",
  addingTransaction: "Error adding the transaction to database",
  addingSubscription: "Error adding the subscription to database",
  fileParsing: "File processing failed. Try again later",
  fileType: "Wrong file type. Only CSV is allowed",
  dateFormatCSV: "Please, select the correct date format used on your CSV file",
  csvNoColumns: "Columns not found on the CSV",
  incorrectTransactionsData:
    "The transactions provided are not correct. Try again later",
  incorrectSubscriptionData:
    "The subscription data provided is not correct. Try again later",
  deletingTransactions: `Couldn't delete the selected transactions. Try again later`,
  deletingSubscriptions: `Couldn't delete the selected subscriptions. Try again later`,
  retrieveCategories: "There was an error retrieving the categories",
  updateTransaction: "There was an error updating the transaction",
  updateSubscription: "There was an error updating the subscription",
  createTransaction: "There was an error creating the transaction",
  retrieveSubscriptions: "There was an error retrieving the subscriptions",
  incorrectData: "There was an error with the data retrieved. Try again later",
  recoveryPassword:
    "There was an error sending the recovery password email. Try again later",
  tokenExpired: "The verification link has expired",
} as const;

export const dateFormat = {
  ISO: "yyyy-MM-dd",
  US: "MM/dd/yyyy",
  EU: "dd/MM/yyyy",
  monthYear: "yyyy-MM",
  shortMonth: "MMM",
  shortMonthWithYear: "MMM yy",
} as const;

export const shortDateFormat = {
  ISO: "yy-MM-dd",
  US: "MM/dd/yy",
  EU: "dd/MM/yy",
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

export const DEFAULT_CALLBACK_URL = "/dashboard";
export const URL_POST_TRANSACTION = `/api/transactions/filtered`;
export const URL_UPDATE_USER_TRANS_DATES = `/api/user/update-trans-dates`;
export const URL_UPLOAD_TRANSACTION_FILE = `/api/transactions/upload`;
export const URL_GET_CSV_HEADERS = `/api/transactions/get-csv-headers`;
export const URL_UPLOAD_BULK_TRANSACTION = `/api/transactions/add/bulk`;
export const URL_DELETE_TRANSACTIONS = `/api/transactions/delete`;
export const URL_USER_CATEGORIES = `/api/user/categories`;
export const URL_UPDATE_CATEGORY = `/api/transactions/update`;
export const URL_CREATE_TRANSACTION = `/api/transactions/add/single`;
export const URL_ADD_SUBSCRIPTION = `/api/user/subscriptions/add`;
export const URL_GET_SUBSCRIPTION = `/api/user/subscriptions`;
export const URL_UPDATE_SUBSCRIPTION = `/api/user/subscriptions/update`;
export const URL_DELETE_SUBSCRIPTION = `/api/user/subscriptions/delete`;
export const URL_RECOVER_PASSWORD = `/api/auth/recover-password`;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

export const DATES_CSV_FORMAT_OPTIONS = [
  "dd-MM-yyyy",
  "MM-dd-yyyy",
  "yyyy-MM-dd",
  "dd/MM/yyyy",
  "MM/dd/yyyy",
  "yyyy/MM/dd",
];

export const FIELDS_FROM_CSV = ["Date", "Concept", "Amount", "Notes"];

export const formatterUS = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});
