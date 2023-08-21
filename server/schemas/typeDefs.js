const typeDefs = `#graphql
  type Query {
    me: User
  }
  
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    bookCount: String
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

 # input type grouping sets of arguments together to be used as an argument to another field
  input SaveBookInfo {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(bookData: SaveBookInfo!): User
    deleteBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
