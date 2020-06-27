import {Car} from './car';

export class Series {
  id: string;
  name: string;
  isTeam: boolean;
  isArchived: boolean;
  logoImgUrl: string;
  description: string;
  lastUpdated: Date;
  carIds: string[];
  cars: Car[];
}
