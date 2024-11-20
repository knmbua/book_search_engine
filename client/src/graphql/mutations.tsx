import { gql } from '@apollo/client';

// Auth Mutations
export const REGISTER_USER = gql`
mutation Mutation($username: String!, $email: String!, $password: String!) {
  registerUser(username: $username, email: $email, password: $password) {
    user {
      _id
      username
    }
  }
}
`;

export const LOGIN_USER = gql`
mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    message
    user {
      _id
      username
    }
  }
}
`;

export const LOGOUT_USER = gql`
mutation LogoutUser {
  logoutUser {
    message
  }
}
`;

export const SAVE_BOOK = gql`
 mutation SaveBook($googleBookId: String!, $authors: [String]!, $title: String!, $description: String!, $image: String!) {
  saveBook(googleBookId: $googleBookId, authors: $authors, title: $title, description: $description, image: $image) {
    user {
      _id
      username
      email
      savedBooks {
        googleBookId
        authors
        description
        title
        image
        link
      }
    }
  }
}
`;
export const DELETE_BOOK = gql`
mutation DeleteBook($googleBookId: String!) {
  deleteBook(googleBookId: $googleBookId) {
    message
    user {
      _id
      username
      email
      savedBooks {
        googleBookId
        authors
        description
        title
        image
        link
      }
    }
  }
}
`;