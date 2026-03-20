/* eslint-disable */
import * as types from './graphql.ts'
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  '\n  fragment AccountFields on Account {\n    id\n    name\n    icon\n    currency\n    balance\n    initialBalance\n  }\n': typeof types.AccountFieldsFragmentDoc
  '\n    query AccountFormCurrencies {\n      currencies {\n        code\n        name\n      }\n    }\n  ': typeof types.AccountFormCurrenciesDocument
  '\n    mutation CreateAccount($input: CreateAccountInput!) {\n      createAccount(input: $input) {\n        id\n        ...AccountFields\n      }\n    }\n  ': typeof types.CreateAccountDocument
  '\n    mutation UpdateAccount($input: UpdateAccountInput!) {\n      updateAccount(input: $input) {\n        id\n        ...AccountFields\n      }\n    }\n  ': typeof types.UpdateAccountDocument
  '\n    mutation DeleteAccount($id: ID!) {\n      deleteAccount(id: $id)\n    }\n  ': typeof types.DeleteAccountDocument
  '\n  fragment CategoryFields on Category {\n    id\n    name\n    icon\n    kind\n  }\n': typeof types.CategoryFieldsFragmentDoc
  '\n    mutation CreateCategory($input: CreateCategoryInput!) {\n      createCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  ': typeof types.CreateCategoryDocument
  '\n    mutation UpdateCategory($input: UpdateCategoryInput!) {\n      updateCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  ': typeof types.UpdateCategoryDocument
  '\n    mutation DeleteCategory($id: ID!) {\n      deleteCategory(id: $id)\n    }\n  ': typeof types.DeleteCategoryDocument
  '\n  fragment TransactionFields on Transaction {\n    id\n    kind\n    amount\n    destinationAmount\n    description\n    createdAt\n    account {\n      id\n      currency\n    }\n    destinationAccount {\n      id\n      currency\n    }\n    category {\n      id\n      name\n      icon\n    }\n  }\n': typeof types.TransactionFieldsFragmentDoc
  '\n  query MeForCurrency {\n    me {\n      id\n      defaultCurrency {\n        code\n        minorUnits\n      }\n    }\n  }\n': typeof types.MeForCurrencyDocument
  '\n    query AccountsMe {\n      me {\n        id\n        balance\n      }\n    }\n  ': typeof types.AccountsMeDocument
  '\n    query Accounts($after: String) {\n      accounts(after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            balance\n            ...AccountFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ': typeof types.AccountsDocument
  '\n    query EditTransaction($id: ID!) {\n      transaction(id: $id) {\n        id\n        kind\n        amount\n        destinationAmount\n        description\n        account {\n          id\n        }\n        destinationAccount {\n          id\n        }\n        category {\n          id\n        }\n      }\n    }\n  ': typeof types.EditTransactionDocument
  '\n    query AddTransactionCategories {\n      categories {\n        edges {\n          node {\n            id\n            name\n            icon\n            kind\n          }\n        }\n      }\n    }\n  ': typeof types.AddTransactionCategoriesDocument
  '\n    query AddTransactionAccounts {\n      accounts {\n        edges {\n          node {\n            id\n            name\n            icon\n            currency\n          }\n        }\n      }\n    }\n  ': typeof types.AddTransactionAccountsDocument
  '\n    mutation CreateTransaction($input: CreateTransactionInput!) {\n      createTransaction(input: $input) {\n        id\n        ...TransactionFields\n      }\n    }\n  ': typeof types.CreateTransactionDocument
  '\n    mutation UpdateTransaction($input: UpdateTransactionInput!) {\n      updateTransaction(input: $input) {\n        id\n        ...TransactionFields\n      }\n    }\n  ': typeof types.UpdateTransactionDocument
  '\n    mutation DeleteTransaction($id: ID!) {\n      deleteTransaction(id: $id)\n    }\n  ': typeof types.DeleteTransactionDocument
  '\n    query AuthCurrencies {\n      currencies {\n        code\n        name\n      }\n    }\n  ': typeof types.AuthCurrenciesDocument
  '\n    mutation SignIn($input: SignInInput!) {\n      signIn(input: $input) {\n        token\n      }\n    }\n  ': typeof types.SignInDocument
  '\n    mutation SignUp($input: SignUpInput!) {\n      signUp(input: $input) {\n        token\n      }\n    }\n  ': typeof types.SignUpDocument
  '\n    query Categories($after: String) {\n      categories(after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            kind\n            ...CategoryFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ': typeof types.CategoriesDocument
  '\n    query DashboardMe {\n      me {\n        id\n        balance\n      }\n    }\n  ': typeof types.DashboardMeDocument
  '\n    query Transactions($filter: TransactionFilterInput, $after: String) {\n      transactions(filter: $filter, after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            kind\n            amount\n            createdAt\n            category {\n              id\n              name\n              icon\n            }\n            ...TransactionFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ': typeof types.TransactionsDocument
}
const documents: Documents = {
  '\n  fragment AccountFields on Account {\n    id\n    name\n    icon\n    currency\n    balance\n    initialBalance\n  }\n':
    types.AccountFieldsFragmentDoc,
  '\n    query AccountFormCurrencies {\n      currencies {\n        code\n        name\n      }\n    }\n  ':
    types.AccountFormCurrenciesDocument,
  '\n    mutation CreateAccount($input: CreateAccountInput!) {\n      createAccount(input: $input) {\n        id\n        ...AccountFields\n      }\n    }\n  ':
    types.CreateAccountDocument,
  '\n    mutation UpdateAccount($input: UpdateAccountInput!) {\n      updateAccount(input: $input) {\n        id\n        ...AccountFields\n      }\n    }\n  ':
    types.UpdateAccountDocument,
  '\n    mutation DeleteAccount($id: ID!) {\n      deleteAccount(id: $id)\n    }\n  ':
    types.DeleteAccountDocument,
  '\n  fragment CategoryFields on Category {\n    id\n    name\n    icon\n    kind\n  }\n':
    types.CategoryFieldsFragmentDoc,
  '\n    mutation CreateCategory($input: CreateCategoryInput!) {\n      createCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  ':
    types.CreateCategoryDocument,
  '\n    mutation UpdateCategory($input: UpdateCategoryInput!) {\n      updateCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  ':
    types.UpdateCategoryDocument,
  '\n    mutation DeleteCategory($id: ID!) {\n      deleteCategory(id: $id)\n    }\n  ':
    types.DeleteCategoryDocument,
  '\n  fragment TransactionFields on Transaction {\n    id\n    kind\n    amount\n    destinationAmount\n    description\n    createdAt\n    account {\n      id\n      currency\n    }\n    destinationAccount {\n      id\n      currency\n    }\n    category {\n      id\n      name\n      icon\n    }\n  }\n':
    types.TransactionFieldsFragmentDoc,
  '\n  query MeForCurrency {\n    me {\n      id\n      defaultCurrency {\n        code\n        minorUnits\n      }\n    }\n  }\n':
    types.MeForCurrencyDocument,
  '\n    query AccountsMe {\n      me {\n        id\n        balance\n      }\n    }\n  ':
    types.AccountsMeDocument,
  '\n    query Accounts($after: String) {\n      accounts(after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            balance\n            ...AccountFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ':
    types.AccountsDocument,
  '\n    query EditTransaction($id: ID!) {\n      transaction(id: $id) {\n        id\n        kind\n        amount\n        destinationAmount\n        description\n        account {\n          id\n        }\n        destinationAccount {\n          id\n        }\n        category {\n          id\n        }\n      }\n    }\n  ':
    types.EditTransactionDocument,
  '\n    query AddTransactionCategories {\n      categories {\n        edges {\n          node {\n            id\n            name\n            icon\n            kind\n          }\n        }\n      }\n    }\n  ':
    types.AddTransactionCategoriesDocument,
  '\n    query AddTransactionAccounts {\n      accounts {\n        edges {\n          node {\n            id\n            name\n            icon\n            currency\n          }\n        }\n      }\n    }\n  ':
    types.AddTransactionAccountsDocument,
  '\n    mutation CreateTransaction($input: CreateTransactionInput!) {\n      createTransaction(input: $input) {\n        id\n        ...TransactionFields\n      }\n    }\n  ':
    types.CreateTransactionDocument,
  '\n    mutation UpdateTransaction($input: UpdateTransactionInput!) {\n      updateTransaction(input: $input) {\n        id\n        ...TransactionFields\n      }\n    }\n  ':
    types.UpdateTransactionDocument,
  '\n    mutation DeleteTransaction($id: ID!) {\n      deleteTransaction(id: $id)\n    }\n  ':
    types.DeleteTransactionDocument,
  '\n    query AuthCurrencies {\n      currencies {\n        code\n        name\n      }\n    }\n  ':
    types.AuthCurrenciesDocument,
  '\n    mutation SignIn($input: SignInInput!) {\n      signIn(input: $input) {\n        token\n      }\n    }\n  ':
    types.SignInDocument,
  '\n    mutation SignUp($input: SignUpInput!) {\n      signUp(input: $input) {\n        token\n      }\n    }\n  ':
    types.SignUpDocument,
  '\n    query Categories($after: String) {\n      categories(after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            kind\n            ...CategoryFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ':
    types.CategoriesDocument,
  '\n    query DashboardMe {\n      me {\n        id\n        balance\n      }\n    }\n  ':
    types.DashboardMeDocument,
  '\n    query Transactions($filter: TransactionFilterInput, $after: String) {\n      transactions(filter: $filter, after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            kind\n            amount\n            createdAt\n            category {\n              id\n              name\n              icon\n            }\n            ...TransactionFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ':
    types.TransactionsDocument,
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment AccountFields on Account {\n    id\n    name\n    icon\n    currency\n    balance\n    initialBalance\n  }\n',
): (typeof documents)['\n  fragment AccountFields on Account {\n    id\n    name\n    icon\n    currency\n    balance\n    initialBalance\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query AccountFormCurrencies {\n      currencies {\n        code\n        name\n      }\n    }\n  ',
): (typeof documents)['\n    query AccountFormCurrencies {\n      currencies {\n        code\n        name\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation CreateAccount($input: CreateAccountInput!) {\n      createAccount(input: $input) {\n        id\n        ...AccountFields\n      }\n    }\n  ',
): (typeof documents)['\n    mutation CreateAccount($input: CreateAccountInput!) {\n      createAccount(input: $input) {\n        id\n        ...AccountFields\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation UpdateAccount($input: UpdateAccountInput!) {\n      updateAccount(input: $input) {\n        id\n        ...AccountFields\n      }\n    }\n  ',
): (typeof documents)['\n    mutation UpdateAccount($input: UpdateAccountInput!) {\n      updateAccount(input: $input) {\n        id\n        ...AccountFields\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation DeleteAccount($id: ID!) {\n      deleteAccount(id: $id)\n    }\n  ',
): (typeof documents)['\n    mutation DeleteAccount($id: ID!) {\n      deleteAccount(id: $id)\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment CategoryFields on Category {\n    id\n    name\n    icon\n    kind\n  }\n',
): (typeof documents)['\n  fragment CategoryFields on Category {\n    id\n    name\n    icon\n    kind\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation CreateCategory($input: CreateCategoryInput!) {\n      createCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  ',
): (typeof documents)['\n    mutation CreateCategory($input: CreateCategoryInput!) {\n      createCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation UpdateCategory($input: UpdateCategoryInput!) {\n      updateCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  ',
): (typeof documents)['\n    mutation UpdateCategory($input: UpdateCategoryInput!) {\n      updateCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation DeleteCategory($id: ID!) {\n      deleteCategory(id: $id)\n    }\n  ',
): (typeof documents)['\n    mutation DeleteCategory($id: ID!) {\n      deleteCategory(id: $id)\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TransactionFields on Transaction {\n    id\n    kind\n    amount\n    destinationAmount\n    description\n    createdAt\n    account {\n      id\n      currency\n    }\n    destinationAccount {\n      id\n      currency\n    }\n    category {\n      id\n      name\n      icon\n    }\n  }\n',
): (typeof documents)['\n  fragment TransactionFields on Transaction {\n    id\n    kind\n    amount\n    destinationAmount\n    description\n    createdAt\n    account {\n      id\n      currency\n    }\n    destinationAccount {\n      id\n      currency\n    }\n    category {\n      id\n      name\n      icon\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query MeForCurrency {\n    me {\n      id\n      defaultCurrency {\n        code\n        minorUnits\n      }\n    }\n  }\n',
): (typeof documents)['\n  query MeForCurrency {\n    me {\n      id\n      defaultCurrency {\n        code\n        minorUnits\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query AccountsMe {\n      me {\n        id\n        balance\n      }\n    }\n  ',
): (typeof documents)['\n    query AccountsMe {\n      me {\n        id\n        balance\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query Accounts($after: String) {\n      accounts(after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            balance\n            ...AccountFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ',
): (typeof documents)['\n    query Accounts($after: String) {\n      accounts(after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            balance\n            ...AccountFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query EditTransaction($id: ID!) {\n      transaction(id: $id) {\n        id\n        kind\n        amount\n        destinationAmount\n        description\n        account {\n          id\n        }\n        destinationAccount {\n          id\n        }\n        category {\n          id\n        }\n      }\n    }\n  ',
): (typeof documents)['\n    query EditTransaction($id: ID!) {\n      transaction(id: $id) {\n        id\n        kind\n        amount\n        destinationAmount\n        description\n        account {\n          id\n        }\n        destinationAccount {\n          id\n        }\n        category {\n          id\n        }\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query AddTransactionCategories {\n      categories {\n        edges {\n          node {\n            id\n            name\n            icon\n            kind\n          }\n        }\n      }\n    }\n  ',
): (typeof documents)['\n    query AddTransactionCategories {\n      categories {\n        edges {\n          node {\n            id\n            name\n            icon\n            kind\n          }\n        }\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query AddTransactionAccounts {\n      accounts {\n        edges {\n          node {\n            id\n            name\n            icon\n            currency\n          }\n        }\n      }\n    }\n  ',
): (typeof documents)['\n    query AddTransactionAccounts {\n      accounts {\n        edges {\n          node {\n            id\n            name\n            icon\n            currency\n          }\n        }\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation CreateTransaction($input: CreateTransactionInput!) {\n      createTransaction(input: $input) {\n        id\n        ...TransactionFields\n      }\n    }\n  ',
): (typeof documents)['\n    mutation CreateTransaction($input: CreateTransactionInput!) {\n      createTransaction(input: $input) {\n        id\n        ...TransactionFields\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation UpdateTransaction($input: UpdateTransactionInput!) {\n      updateTransaction(input: $input) {\n        id\n        ...TransactionFields\n      }\n    }\n  ',
): (typeof documents)['\n    mutation UpdateTransaction($input: UpdateTransactionInput!) {\n      updateTransaction(input: $input) {\n        id\n        ...TransactionFields\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation DeleteTransaction($id: ID!) {\n      deleteTransaction(id: $id)\n    }\n  ',
): (typeof documents)['\n    mutation DeleteTransaction($id: ID!) {\n      deleteTransaction(id: $id)\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query AuthCurrencies {\n      currencies {\n        code\n        name\n      }\n    }\n  ',
): (typeof documents)['\n    query AuthCurrencies {\n      currencies {\n        code\n        name\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation SignIn($input: SignInInput!) {\n      signIn(input: $input) {\n        token\n      }\n    }\n  ',
): (typeof documents)['\n    mutation SignIn($input: SignInInput!) {\n      signIn(input: $input) {\n        token\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation SignUp($input: SignUpInput!) {\n      signUp(input: $input) {\n        token\n      }\n    }\n  ',
): (typeof documents)['\n    mutation SignUp($input: SignUpInput!) {\n      signUp(input: $input) {\n        token\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query Categories($after: String) {\n      categories(after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            kind\n            ...CategoryFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ',
): (typeof documents)['\n    query Categories($after: String) {\n      categories(after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            kind\n            ...CategoryFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query DashboardMe {\n      me {\n        id\n        balance\n      }\n    }\n  ',
): (typeof documents)['\n    query DashboardMe {\n      me {\n        id\n        balance\n      }\n    }\n  ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query Transactions($filter: TransactionFilterInput, $after: String) {\n      transactions(filter: $filter, after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            kind\n            amount\n            createdAt\n            category {\n              id\n              name\n              icon\n            }\n            ...TransactionFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ',
): (typeof documents)['\n    query Transactions($filter: TransactionFilterInput, $after: String) {\n      transactions(filter: $filter, after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            kind\n            amount\n            createdAt\n            category {\n              id\n              name\n              icon\n            }\n            ...TransactionFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
