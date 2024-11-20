import User from '../../models/User.js';
import { getUserId } from '../../services/auth.js';
import { getErrorMessage } from '../helpers/index.js';
const user_resolvers = {
    Query: {
        getUserBooks: async (_, __, { req }) => {
            const user_id = getUserId(req);
            if (!user_id) {
                return [];
            }
            const user = await User.findById(user_id);
            return user?.savedBooks;
        }
    },
    Mutation: {
        saveBook: async (_, { book }, { req }) => {
            try {
                await User.findOneAndUpdate({ _id: req.user_id }, { $addToSet: { savedBooks: book } }, { new: true, runValidators: true });
                return {
                    message: 'Book saved successfully!'
                };
            }
            catch (error) {
                console.log('SAVE BOOK ERROR', error);
                const errorMessage = getErrorMessage(error);
                return {
                    message: errorMessage
                };
            }
        },
        deleteBook: async (_, { bookId }, { req }) => {
            const updatedUser = await User.findOneAndUpdate({ _id: req.user_id }, { $pull: { savedBooks: { googleBookId: bookId } } }, { new: true });
            if (!updatedUser) {
                return { message: "Couldn't find user with this id!" };
            }
            return {
                message: 'Book deleted successfully!'
            };
        }
    }
};
export default user_resolvers;
