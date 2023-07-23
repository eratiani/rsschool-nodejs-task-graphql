import { IMember } from './memberType.js';
import { IUser } from './userTypes.js';

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  user: IUser;
  userId: string;
  memberType: IMember;
  memberTypeId: string;
}
