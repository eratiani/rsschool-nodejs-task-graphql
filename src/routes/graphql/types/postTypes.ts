import { FastifyInstance } from 'fastify';
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { IUser, User } from './userTypes.js';
import { UUIDType } from './uuid.js';

export interface IPost {
  id: string;
  title: string;
  content: string;
  author?: IUser;
  authorId: string;
}
class Post {
  static type: GraphQLObjectType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
      id: {
        type: UUIDType,
      },
      title: {
        type: GraphQLString,
      },
      content: {
        type: GraphQLString,
      },
      authorId: {
        type: UUIDType,
      },
      author: {
        type: User.type,
        resolve: User.resolver.usersFromPost,
      },
    }),
  });

  static arrayType = new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post.type)));

  static resolver = {
    getOnce: async (_parent, args: { id: string }, fastify: FastifyInstance) => {
      const post = await fastify.prisma.post.findUnique({
        where: {
          id: args.id,
        },
      });
      return post;
    },
    getAll: async (_parent, _args, fastify: FastifyInstance) => {
      return fastify.prisma.post.findMany();
    },
    postFromParent: async (parent: IUser, _args, fastify: FastifyInstance) => {
      return fastify.prisma.post.findMany({
        where: {
          authorId: parent.id,
        },
      });
    },
  };
}

const post = {
  type: Post.type,
  args: { id: { type: UUIDType } },
  resolve: Post.resolver.getOnce,
};

const posts = {
  type: Post.arrayType,
  resolve: Post.resolver.getAll,
};

export { post, posts, Post };
