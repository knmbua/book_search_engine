
import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import User from '../../models/User';
import { signToken, getUserId } from '../../services/auth';
import { getErrorMessage } from '../../helpers/index.js';

const auth_resolvers = {
  Query: {
    getUser: async (_: any, __: any, { req }: { req: Request }) => {
      const user_id = getUserId(req);

      if (!user_id) {
        return {
          user: null
        };
      }

      const user = await User.findById(user_id).select('_id username savedBooks');

      if (!user) {
        return {
          user: null
        };
      }

      return {
        user: user
      };
    }
  },
  Mutation: {
    registerUser: async (_: any, { input }: { input: any }, { res }: { res: Response }) => {
      try {
        const user = await User.create(input);
        const token = signToken(user._id as Types.ObjectId);

        res.cookie('book_app_token', token, {
          httpOnly: true,
          secure: process.env.PORT ? true : false,
          sameSite: true
        });

        return { user };
      } catch (error: any) {
        const errorMessage = getErrorMessage(error);

        return {
          message: errorMessage
        };
      }
    },
    loginUser: async (_: any, { input }: { input: any }, { res }: { res: Response }) => {
      const user = await User.findOne({ email: input.email });

      if (!user) {
        return { message: "No user found with that email address" };
      }

      const valid_pass = await user.validatePassword(input.password);

      if (!valid_pass) {
        return { message: 'Wrong password!' };
      }

      const token = signToken(user._id as Types.ObjectId);

      res.cookie('book_app_token', token, {
        httpOnly: true,
        secure: process.env.PORT ? true : false,
        sameSite: true
      });

      return { user };
    },
    logoutUser: async (_: any, __: any, { res }: { res: Response }) => {
      res.clearCookie('book_app_token');
      return {
        message: 'Logged out successfully!'
      };
    }
  }
};

export default auth_resolvers;
