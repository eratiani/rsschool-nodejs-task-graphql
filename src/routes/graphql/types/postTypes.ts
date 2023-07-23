import { IUser } from './userTypes.js';

export interface IPost {
  id: string;
  title: string;
  content: string;
  author?: IUser;
  authorId: string;
}
