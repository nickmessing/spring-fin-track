/* eslint-disable */
import * as types from './graphql.ts';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

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
    "\n  fragment CategoryFields on Category {\n    id\n    name\n    icon\n    kind\n  }\n": typeof types.CategoryFieldsFragmentDoc,
    "\n    mutation CreateCategory($input: CreateCategoryInput!) {\n      createCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  ": typeof types.CreateCategoryDocument,
    "\n    mutation UpdateCategory($input: UpdateCategoryInput!) {\n      updateCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  ": typeof types.UpdateCategoryDocument,
    "\n    mutation DeleteCategory($id: ID!) {\n      deleteCategory(id: $id)\n    }\n  ": typeof types.DeleteCategoryDocument,
    "\n    query AuthCurrencies {\n      currencies {\n        code\n        name\n      }\n    }\n  ": typeof types.AuthCurrenciesDocument,
    "\n    mutation SignIn($input: SignInInput!) {\n      signIn(input: $input) {\n        token\n      }\n    }\n  ": typeof types.SignInDocument,
    "\n    mutation SignUp($input: SignUpInput!) {\n      signUp(input: $input) {\n        token\n      }\n    }\n  ": typeof types.SignUpDocument,
    "\n    query Categories($after: String) {\n      categories(after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            kind\n            ...CategoryFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ": typeof types.CategoriesDocument,
};
const documents: Documents = {
    "\n  fragment CategoryFields on Category {\n    id\n    name\n    icon\n    kind\n  }\n": types.CategoryFieldsFragmentDoc,
    "\n    mutation CreateCategory($input: CreateCategoryInput!) {\n      createCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  ": types.CreateCategoryDocument,
    "\n    mutation UpdateCategory($input: UpdateCategoryInput!) {\n      updateCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  ": types.UpdateCategoryDocument,
    "\n    mutation DeleteCategory($id: ID!) {\n      deleteCategory(id: $id)\n    }\n  ": types.DeleteCategoryDocument,
    "\n    query AuthCurrencies {\n      currencies {\n        code\n        name\n      }\n    }\n  ": types.AuthCurrenciesDocument,
    "\n    mutation SignIn($input: SignInInput!) {\n      signIn(input: $input) {\n        token\n      }\n    }\n  ": types.SignInDocument,
    "\n    mutation SignUp($input: SignUpInput!) {\n      signUp(input: $input) {\n        token\n      }\n    }\n  ": types.SignUpDocument,
    "\n    query Categories($after: String) {\n      categories(after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            kind\n            ...CategoryFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  ": types.CategoriesDocument,
};

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
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CategoryFields on Category {\n    id\n    name\n    icon\n    kind\n  }\n"): (typeof documents)["\n  fragment CategoryFields on Category {\n    id\n    name\n    icon\n    kind\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateCategory($input: CreateCategoryInput!) {\n      createCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  "): (typeof documents)["\n    mutation CreateCategory($input: CreateCategoryInput!) {\n      createCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateCategory($input: UpdateCategoryInput!) {\n      updateCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  "): (typeof documents)["\n    mutation UpdateCategory($input: UpdateCategoryInput!) {\n      updateCategory(input: $input) {\n        id\n        ...CategoryFields\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteCategory($id: ID!) {\n      deleteCategory(id: $id)\n    }\n  "): (typeof documents)["\n    mutation DeleteCategory($id: ID!) {\n      deleteCategory(id: $id)\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query AuthCurrencies {\n      currencies {\n        code\n        name\n      }\n    }\n  "): (typeof documents)["\n    query AuthCurrencies {\n      currencies {\n        code\n        name\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SignIn($input: SignInInput!) {\n      signIn(input: $input) {\n        token\n      }\n    }\n  "): (typeof documents)["\n    mutation SignIn($input: SignInInput!) {\n      signIn(input: $input) {\n        token\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SignUp($input: SignUpInput!) {\n      signUp(input: $input) {\n        token\n      }\n    }\n  "): (typeof documents)["\n    mutation SignUp($input: SignUpInput!) {\n      signUp(input: $input) {\n        token\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Categories($after: String) {\n      categories(after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            kind\n            ...CategoryFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  "): (typeof documents)["\n    query Categories($after: String) {\n      categories(after: $after) {\n        edges {\n          cursor\n          node {\n            id\n            kind\n            ...CategoryFields\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;