import { FastifyInstance } from 'fastify';
import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} from 'graphql';
import { IProfile, Profile } from './profileTypes.js';

export interface IMember {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
  profiles: IProfile[];
}
class MemberType {
  static type: GraphQLObjectType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
      id: {
        type: memberTypeId,
      },
      discount: {
        type: GraphQLFloat,
      },
      postsLimitPerMonth: {
        type: GraphQLInt,
      },
      profiles: {
        type: new GraphQLList(Profile.type),
        resolve: Profile.resolver.profileFromMemberType,
      },
    }),
  });

  static arrayType = new GraphQLNonNull(
    new GraphQLList(new GraphQLNonNull(MemberType.type)),
  );

  static resolver = {
    getOnce: async (_parent, args: { id: string }, fastify: FastifyInstance) => {
      const memberType = await fastify.prisma.memberType.findUnique({
        where: {
          id: args.id,
        },
      });
      return memberType;
    },
    getAll: async (_parent, _args, fastify: FastifyInstance) => {
      return fastify.prisma.memberType.findMany();
    },
    memberTypeFromProfile: async (parent: IProfile, _args, fastify: FastifyInstance) => {
      const memberType = await fastify.prisma.memberType.findUnique({
        where: {
          id: parent.memberTypeId,
        },
      });
      return memberType;
    },
  };
}
const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
      value: 'business',
    },
  },
});

export { memberTypeId };
const memberType = {
  type: MemberType.type,
  args: { id: { type: memberTypeId } },
  resolve: MemberType.resolver.getOnce,
};

const memberTypes = {
  type: MemberType.arrayType,
  resolve: MemberType.resolver.getAll,
};

export { memberType, memberTypes, MemberType };
