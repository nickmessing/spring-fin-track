 
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

export type BalancePoint = {
  __typename: 'BalancePoint';
  balance: Scalars['Long']['output'];
  date: Scalars['DateTime']['output'];
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
export type CategoryTotal = {
  __typename: 'CategoryTotal';
  category: Category;
  total: Scalars['Long']['output'];
};

export type CreateAccountInput = {
  currency: Scalars['CurrencyCode']['input'];
  icon: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
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
  id?: InputMaybe<Scalars['ID']['input']>;
  kind: TransactionKind;
};

export type CurrencyInfo = {
  __typename: 'CurrencyInfo';
  code: Scalars['CurrencyCode']['output'];
  minorUnits: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export const Granularity = {
  Day: 'DAY',
  Month: 'MONTH',
  Week: 'WEEK'
} as const;

export type Granularity = typeof Granularity[keyof typeof Granularity];
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
  accountBalanceHistory: Array<BalancePoint>;
  accounts: AccountConnection;
  categories: CategoryConnection;
  category?: Maybe<Category>;
  currencies: Array<CurrencyInfo>;
  currency?: Maybe<CurrencyInfo>;
  me?: Maybe<User>;
  summary: Summary;
  transaction?: Maybe<Transaction>;
  transactions: TransactionConnection;
};


export type QueryAccountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAccountBalanceHistoryArgs = {
  accountId: Scalars['ID']['input'];
  from: Scalars['DateTime']['input'];
  granularity: Granularity;
  to: Scalars['DateTime']['input'];
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


export type QuerySummaryArgs = {
  from?: InputMaybe<Scalars['DateTime']['input']>;
  to?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<TransactionFilterInput>;
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

export type Summary = {
  __typename: 'Summary';
  byCategory: Array<CategoryTotal>;
  totalExpense: Scalars['Long']['output'];
  totalIncome: Scalars['Long']['output'];
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
  filter: TransactionFilter;
  pageInfo: PageInfo;
};

export type TransactionEdge = {
  __typename: 'TransactionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type TransactionFilter = {
  __typename: 'TransactionFilter';
  from?: Maybe<Scalars['DateTime']['output']>;
  to?: Maybe<Scalars['DateTime']['output']>;
};

export type TransactionFilterInput = {
  from?: InputMaybe<Scalars['DateTime']['input']>;
  to?: InputMaybe<Scalars['DateTime']['input']>;
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

export type AccountFieldsFragment = { __typename: 'Account', id: string, name: string, icon: string, currency: string, balance: number, initialBalance: number } & { ' $fragmentName'?: 'AccountFieldsFragment' };

export type AccountFormCurrenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountFormCurrenciesQuery = { __typename: 'Query', currencies: Array<{ __typename: 'CurrencyInfo', code: string, name: string }> };

export type CreateAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;


export type CreateAccountMutation = { __typename: 'Mutation', createAccount: (
    { __typename: 'Account', id: string }
    & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
  ) };

export type UpdateAccountMutationVariables = Exact<{
  input: UpdateAccountInput;
}>;


export type UpdateAccountMutation = { __typename: 'Mutation', updateAccount: (
    { __typename: 'Account', id: string }
    & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
  ) };

export type DeleteAccountMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAccountMutation = { __typename: 'Mutation', deleteAccount: boolean };

export type CategoryFieldsFragment = { __typename: 'Category', id: string, name: string, icon: string, kind: CategoryKind } & { ' $fragmentName'?: 'CategoryFieldsFragment' };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename: 'Mutation', createCategory: (
    { __typename: 'Category', id: string }
    & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
  ) };

export type UpdateCategoryMutationVariables = Exact<{
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename: 'Mutation', updateCategory: (
    { __typename: 'Category', id: string }
    & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
  ) };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCategoryMutation = { __typename: 'Mutation', deleteCategory: boolean };

export type MeForCurrencyQueryVariables = Exact<{ [key: string]: never; }>;


export type MeForCurrencyQuery = { __typename: 'Query', me?: { __typename: 'User', defaultCurrency: { __typename: 'CurrencyInfo', symbol: string, minorUnits: number } } | null };

export type AccountsMeQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountsMeQuery = { __typename: 'Query', me?: { __typename: 'User', balance: number } | null };

export type AccountsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountsQuery = { __typename: 'Query', accounts: { __typename: 'AccountConnection', edges: Array<{ __typename: 'AccountEdge', cursor: string, node: (
        { __typename: 'Account', id: string, balance: number }
        & { ' $fragmentRefs'?: { 'AccountFieldsFragment': AccountFieldsFragment } }
      ) }>, pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type AuthCurrenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthCurrenciesQuery = { __typename: 'Query', currencies: Array<{ __typename: 'CurrencyInfo', code: string, name: string }> };

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = { __typename: 'Mutation', signIn: { __typename: 'AuthPayload', token: string } };

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { __typename: 'Mutation', signUp: { __typename: 'AuthPayload', token: string } };

export type CategoriesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type CategoriesQuery = { __typename: 'Query', categories: { __typename: 'CategoryConnection', edges: Array<{ __typename: 'CategoryEdge', cursor: string, node: (
        { __typename: 'Category', id: string, kind: CategoryKind }
        & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
      ) }>, pageInfo: { __typename: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export const AccountFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"initialBalance"}}]}}]} as unknown as DocumentNode<AccountFieldsFragment, unknown>;
export const CategoryFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}}]}}]} as unknown as DocumentNode<CategoryFieldsFragment, unknown>;
export const AccountFormCurrenciesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountFormCurrencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AccountFormCurrenciesQuery, AccountFormCurrenciesQueryVariables>;
export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AccountFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"initialBalance"}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const UpdateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AccountFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"initialBalance"}}]}}]} as unknown as DocumentNode<UpdateAccountMutation, UpdateAccountMutationVariables>;
export const DeleteAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const MeForCurrencyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MeForCurrency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultCurrency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"minorUnits"}}]}}]}}]}}]} as unknown as DocumentNode<MeForCurrencyQuery, MeForCurrencyQueryVariables>;
export const AccountsMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountsMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}}]} as unknown as DocumentNode<AccountsMeQuery, AccountsMeQueryVariables>;
export const AccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Accounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AccountFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"initialBalance"}}]}}]} as unknown as DocumentNode<AccountsQuery, AccountsQueryVariables>;
export const AuthCurrenciesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthCurrencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AuthCurrenciesQuery, AuthCurrenciesQueryVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const CategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Categories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}}]}}]} as unknown as DocumentNode<CategoriesQuery, CategoriesQueryVariables>;
