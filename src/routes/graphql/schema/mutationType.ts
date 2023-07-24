import { GraphQLObjectType } from 'graphql';
import { createPost, changePost, deletePost } from '../types/postTypes.js';
import { createProfile, changeProfile, deleteProfile } from '../types/profileTypes.js';
import {
  createUser,
  changeUser,
  deleteUser,
  subscribeTo,
  unsubscribeFrom,
} from '../types/userTypes.js';

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser,
    changeUser,
    deleteUser,

    createProfile,
    changeProfile,
    deleteProfile,

    createPost,
    changePost,
    deletePost,
    subscribeTo,
    unsubscribeFrom,
  },
});

export default Mutation;
