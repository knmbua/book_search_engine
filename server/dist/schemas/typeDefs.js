const gql = String.raw;
const typeDefs = gql `
  type Book {
    _id: ID!
    googleBookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type User {
    _id: ID!
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Response {
    user: User
    message: String
    errors: [String]
  }

  type Query {
    getUser: Response
    getUserBooks: [Book]
  }

  type Mutation {
        registerUser(username: String!, email: String!, password: String!): Response
        loginUser(email: String!, password: String!): Response
        logoutUser: Response
        saveBook(book: BookInput!): Response
        deleteBook(googleBookId: String!): Response
    }

  input BookInput {
    _id:ID
    googleBookId: String!
    authors: [String]!
    title: String!
    description: String!
    image: String!
  }
`;
export default typeDefs;
