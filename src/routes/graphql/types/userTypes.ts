import { GraphQLFloat, GraphQLObjectType, GraphQLString } from 'graphql';
import { ISubscription } from './dataLoaderTypes.js';
import { IPost } from './postTypes.js';
import { IProfile } from './profileTypes.js';
import { UUIDType } from './uuid.js';

export interface IUser {
  id: string;
  name: string;
  balance: number;
  profile?: IProfile;
  posts?: IPost[];
  userSubscribedTo: ISubscription[];
  subscribedToUser: ISubscription[];
}
class User {
  static type: GraphQLObjectType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: UUIDType },
      name: {
        type: GraphQLString,
      },
      balance: {
        type: GraphQLFloat,
      },
    }),
  });
}
