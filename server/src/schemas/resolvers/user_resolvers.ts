import {Request} from 'express';
import User from '../../models/User.js';
import { getErrorMessage } from '../helpers/index.js';
import { GraphQLError } from 'graphql';

const user_resolvers = {
  Query: {
    getUserBooks: async (_: any, __: any, { req }: { req: Request }) => {
      const user_id = req.user_id;
      
      if (!user_id) {
        return [];
      }

      const user = await User.findById(user_id);

      return user?.savedBooks;
    }
  },
  Mutation: {
    saveBook: async (_: any, { book }: { book: any }, { req }: { req: any }) => {
      if (!req.user_id) {
        throw new GraphQLError('You must be logged in to perform this action');
      }
      try {
        await User.findOneAndUpdate(
          { _id: req.user_id },
          { $addToSet: { savedBooks: book } },
          { new: true, runValidators: true }
        );
        return {
          message: 'Book saved successfully!'
        };
      } catch (error) {
        console.log('SAVE BOOK ERROR', error);

        const errorMessage = getErrorMessage(error);

      
        throw new GraphQLError(errorMessage);
      }
    },
    deleteBook: async (_: any, { bookId }: { bookId: string }, { req }: { req: any }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user_id },
        { $pull: { savedBooks: { googleBookId: bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new GraphQLError("Couldn't find user with this id!");
      }

      return {
        message: 'Book deleted successfully!'
      };
    }
  }
};

export default user_resolvers;