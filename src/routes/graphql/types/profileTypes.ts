import { FastifyInstance } from 'fastify';
import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInputObjectType,
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
interface CreateProfile {
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
    userId: string;
  };
}

interface UpdateProfile {
  id: string;
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
  };
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
  static argsCreate: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: () => ({
      isMale: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      yearOfBirth: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      userId: {
        type: new GraphQLNonNull(UUIDType),
      },
      memberTypeId: {
        type: new GraphQLNonNull(memberTypeId),
      },
    }),
  });

  static argsUpdate: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: () => ({
      isMale: { type: GraphQLBoolean },
      yearOfBirth: { type: GraphQLInt },
      memberTypeId: { type: memberTypeId },
    }),
  });
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
      return await fastify.prisma.profile.findMany();
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
      return await fastify.prisma.profile.findMany({
        where: {
          memberTypeId: parent.id,
        },
      });
    },
    create: async (_parent, args: CreateProfile, fastify: FastifyInstance) => {
      const newProfile = await fastify.prisma.profile.create({
        data: args.dto,
      });
      return newProfile;
    },
    update: async (_parent, args: UpdateProfile, fastify: FastifyInstance) => {
      const updatedProfile = await fastify.prisma.profile.update({
        where: { id: args.id },
        data: args.dto,
      });
      return updatedProfile;
    },
    delete: async (_parent, args: { id: string }, fastify: FastifyInstance) => {
      await fastify.prisma.profile.delete({
        where: {
          id: args.id,
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
const createProfile = {
  type: Profile.type,
  args: {
    dto: {
      type: new GraphQLNonNull(Profile.argsCreate),
    },
  },
  resolve: Profile.resolver.create,
};

const changeProfile = {
  type: Profile.type,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    dto: {
      type: new GraphQLNonNull(Profile.argsUpdate),
    },
  },
  resolve: Profile.resolver.update,
};

const deleteProfile = {
  type: GraphQLBoolean,
  args: {
    id: { type: UUIDType },
  },
  resolve: Profile.resolver.delete,
};
export { profile, profiles, Profile, deleteProfile, createProfile, changeProfile };
