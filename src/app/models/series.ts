import {Car} from './car';

export class Series {
  id: string;
  name: string;
  isTeam: boolean;
  isArchived: boolean;
  logoImgUrl: string;
  description: string;
  isLeague: boolean;
  lastUpdated: Date;
  carIds: string[];
  cars: Car[];
}
