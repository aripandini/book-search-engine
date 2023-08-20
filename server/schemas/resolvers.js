// import user model
const { User } = require('../models');
// import sign token function & error from auth
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        //retrieving the logged in user without specifically searching for them
      me: async (parent, args, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id })
        }
        throw AuthenticationError;
      },
    },
  
    Mutation: {
      addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      },
      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw AuthenticationError;
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw AuthenticationError;
        }
  
        const token = signToken(user);
  
        return { token, user };
      },
      saveBook: async (parent, { savedBooks }, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate({
            _id: context.user._id},
            { $addToSet: { savedBooks: savedBooks } },
            { new: true, runValidators: true });
  
          return updatedUser;
        }
        throw AuthenticationError;
        ('You need to be logged in!');
      },
      deleteBook: async (parent, { bookId }, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate({
            _id: context.user._id},
            { $pull: { savedBooks: bookId._id } },
            { new: true });
  
          return updatedUser;
        }
        throw AuthenticationError;
      },
    },
  };
  
  module.exports = resolvers;