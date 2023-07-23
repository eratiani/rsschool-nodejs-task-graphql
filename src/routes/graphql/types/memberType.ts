import { IProfile } from './profileTypes.js';

export interface IMember {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
  profiles: IProfile[];
}
