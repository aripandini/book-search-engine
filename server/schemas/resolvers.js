// import user model
const { User } = require('../models');
// import sign token function & error from auth
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        //retrieving the logged in user without specifically searching for them
      me: async (parent, args, context) => {
        console.log(context.user)
        if (context.user) {
          const user = await User.findOne({ _id: context.user._id });
          return user;
        }
        throw AuthenticationError;
      },
    },
  
    Mutation: {
        //Creating a user & sign a token
      addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      },
      //Login a user & sign a token
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
      //Save a book to a user's 'savedBooks' field by adding it to the set - preventing duplicates
      saveBook: async (parent, { bookData }, context) => {
        console.log(context.user)
        if (context.user) {
          try {
            const updatedUser = await User.findOneAndUpdate({
              _id: context.user._id},
              { $addToSet: { savedBooks: bookData } },
              { new: true, runValidators: true });
    
            return updatedUser;
          } catch (err) {
            console.log(err);
          }
        }
      },
      //remove a book from 'savedBooks' 
      deleteBook: async (parent, { bookId }, context) => {
        if (context.user) {
          try {
            const updatedUser = await User.findOneAndUpdate({
              _id: context.user._id},
              { $pull: { savedBooks: bookId.bookId } },
              { new: true });
    
            return updatedUser;
          } catch (err) {
            console.log(err);
          }
        }
      },
    },
  };
  
  module.exports = resolvers;