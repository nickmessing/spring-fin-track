 
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** ISO 4217 currency code (e.g. USD, EUR, MDL) */
  CurrencyCode: { input: string; output: string; }
  /** ISO-8601 date-time */
  DateTime: { input: string; output: string; }
  /** 64-bit signed integer for minor-unit monetary amounts */
  Long: { input: number; output: number; }
};

export type Account = {
  __typename: 'Account';
  balance: Scalars['Long']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['CurrencyCode']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  initialBalance: Scalars['Long']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AccountConnection = {
  __typename: 'AccountConnection';
  edges: Array<AccountEdge>;
  pageInfo: PageInfo;
};

export type AccountEdge = {
  __typename: 'AccountEdge';
  cursor: Scalars['String']['output'];
  node: Account;
};

export type AuthPayload = {
  __typename: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type Category = {
  __typename: 'Category';
  createdAt: Scalars['DateTime']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  kind: CategoryKind;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CategoryConnection = {
  __typename: 'CategoryConnection';
  edges: Array<CategoryEdge>;
  filter: CategoryFilter;
  pageInfo: PageInfo;
};

export type CategoryEdge = {
  __typename: 'CategoryEdge';
  cursor: Scalars['String']['output'];
  node: Category;
};

export type CategoryFilter = {
  __typename: 'CategoryFilter';
  kind?: Maybe<CategoryKind>;
};

export type CategoryFilterInput = {
  kind?: InputMaybe<CategoryKind>;
};

export const CategoryKind = {
  Expense: 'EXPENSE',
  Income: 'INCOME'
} as const;

export type CategoryKind = typeof CategoryKind[keyof typeof CategoryKind];
export type CreateAccountInput = {
  currency: Scalars['CurrencyCode']['input'];
  icon: Scalars['String']['input'];
  initialBalance: Scalars['Long']['input'];
  name: Scalars['String']['input'];
};

export type CreateCategoryInput = {
  icon: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  kind: CategoryKind;
  name: Scalars['String']['input'];
};

export type CreateTransactionInput = {
  accountId: Scalars['ID']['input'];
  amount: Scalars['Long']['input'];
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  destinationAccountId?: InputMaybe<Scalars['ID']['input']>;
  destinationAmount?: InputMaybe<Scalars['Long']['input']>;
  kind: TransactionKind;
};

export type CurrencyInfo = {
  __typename: 'CurrencyInfo';
  code: Scalars['CurrencyCode']['output'];
  minorUnits: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type Mutation = {
  __typename: 'Mutation';
  createAccount: Account;
  createCategory: Category;
  createTransaction: Transaction;
  deleteAccount: Scalars['Boolean']['output'];
  deleteCategory: Scalars['Boolean']['output'];
  deleteTransaction: Scalars['Boolean']['output'];
  signIn: AuthPayload;
  signUp: AuthPayload;
  updateAccount: Account;
  updateCategory: Category;
  updateDefaultCurrency: User;
  updateTransaction: Transaction;
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateTransactionArgs = {
  input: CreateTransactionInput;
};


export type MutationDeleteAccountArgs = {
  id: Scalars['ID']['input'];
  mergeIntoId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
  mergeIntoId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationUpdateDefaultCurrencyArgs = {
  currency: Scalars['CurrencyCode']['input'];
};


export type MutationUpdateTransactionArgs = {
  input: UpdateTransactionInput;
};

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type Query = {
  __typename: 'Query';
  account?: Maybe<Account>;
  accounts: AccountConnection;
  categories: CategoryConnection;
  category?: Maybe<Category>;
  currencies: Array<CurrencyInfo>;
  currency?: Maybe<CurrencyInfo>;
  me?: Maybe<User>;
  transaction?: Maybe<Transaction>;
  transactions: TransactionConnection;
};


export type QueryAccountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAccountsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCategoriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<CategoryFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCurrencyArgs = {
  code: Scalars['CurrencyCode']['input'];
};


export type QueryTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignUpInput = {
  defaultCurrency: Scalars['CurrencyCode']['input'];
  displayName?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Subscription = {
  __typename: 'Subscription';
  accountCreated: Account;
  accountDeleted: Scalars['ID']['output'];
  accountUpdated: Account;
  categoryCreated: Category;
  categoryDeleted: Scalars['ID']['output'];
  categoryUpdated: Category;
  transactionCreated: Transaction;
  transactionDeleted: Scalars['ID']['output'];
  transactionUpdated: Transaction;
};

export type Transaction = {
  __typename: 'Transaction';
  account: Account;
  amount: Scalars['Long']['output'];
  category?: Maybe<Category>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  destinationAccount?: Maybe<Account>;
  destinationAmount?: Maybe<Scalars['Long']['output']>;
  id: Scalars['ID']['output'];
  kind: TransactionKind;
  updatedAt: Scalars['DateTime']['output'];
};

export type TransactionConnection = {
  __typename: 'TransactionConnection';
  edges: Array<TransactionEdge>;
  pageInfo: PageInfo;
};

export type TransactionEdge = {
  __typename: 'TransactionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export const TransactionKind = {
  Expense: 'EXPENSE',
  Income: 'INCOME',
  Transfer: 'TRANSFER'
} as const;

export type TransactionKind = typeof TransactionKind[keyof typeof TransactionKind];
export type UpdateAccountInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  initialBalance?: InputMaybe<Scalars['Long']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTransactionInput = {
  accountId?: InputMaybe<Scalars['ID']['input']>;
  amount?: InputMaybe<Scalars['Long']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  destinationAccountId?: InputMaybe<Scalars['ID']['input']>;
  destinationAmount?: InputMaybe<Scalars['Long']['input']>;
  id: Scalars['ID']['input'];
};

export type User = {
  __typename: 'User';
  balance: Scalars['Long']['output'];
  createdAt: Scalars['DateTime']['output'];
  currencies: Array<UserCurrency>;
  defaultCurrency: CurrencyInfo;
  displayName?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type UserCurrency = {
  __typename: 'UserCurrency';
  code: Scalars['CurrencyCode']['output'];
  info: CurrencyInfo;
  rate: Scalars['Float']['output'];
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename: 'Query', currencies: Array<{ __typename: 'CurrencyInfo', code: string, name: string }> };


export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;