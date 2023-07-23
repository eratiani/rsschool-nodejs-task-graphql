import { FastifyInstance } from 'fastify';
import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { IMember, MemberType, memberTypeId } from './memberType.js';
import { IUser, User } from './userTypes.js';
import { UUIDType } from './uuid.js';

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  user: IUser;
  userId: string;
  memberType: IMember;
  memberTypeId: string;
}
class Profile {
  static type: GraphQLObjectType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: {
        type: UUIDType,
      },
      isMale: {
        type: GraphQLBoolean,
      },
      yearOfBirth: {
        type: GraphQLInt,
      },
      userId: {
        type: UUIDType,
      },
      user: {
        type: User.type,
        resolve: User.resolver.usersFromProfile,
      },
      memberTypeId: {
        type: memberTypeId,
      },
      memberType: {
        type: MemberType.type,
        resolve: MemberType.resolver.memberTypeFromProfile,
      },
    }),
  });

  static arrayType = new GraphQLNonNull(
    new GraphQLList(new GraphQLNonNull(Profile.type)),
  );

  static resolver = {
    getOnce: async (_parent, args: { id: string }, fastify: FastifyInstance) => {
      const profile = await fastify.prisma.profile.findUnique({
        where: {
          id: args.id,
        },
      });
      return profile;
    },
    getAll: async (_parent, _args, fastify: FastifyInstance) => {
      return fastify.prisma.profile.findMany();
    },
    profileFromParent: async (parent: IUser, _args, fastify: FastifyInstance) => {
      const profile = await fastify.prisma.profile.findUnique({
        where: {
          userId: parent.id,
        },
      });
      return profile;
    },
    profileFromMemberType: async (parent: IMember, _args, fastify: FastifyInstance) => {
      return fastify.prisma.profile.findMany({
        where: {
          memberTypeId: parent.id,
        },
      });
    },
  };
}

const profile = {
  type: Profile.type,
  args: {
    id: {
      type: UUIDType,
    },
  },
  resolve: Profile.resolver.getOnce,
};

const profiles = {
  type: Profile.arrayType,
  resolve: Profile.resolver.getAll,
};

export { profile, profiles, Profile };
