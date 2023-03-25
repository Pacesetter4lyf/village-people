import { Resource } from '../../shared/resource.model';

export class Individual {
  constructor(
    public firstName: string,
    public lastName: string,
    public nickname: string,
    public dateOfBirth: string,
    public phoneNumber: string,
    public email: string,
    public description: string,
    public countryOfBirth: string,
    public gender: 'male' | 'female' | 'other',
    public appendedTo: string,
    public appendedAs: string,
    public image: string,
    public createdBy: string,

    public settings: {
      all: string[];
      lineage: string[];
    },

    public editableBy?: string,
    public facebookAddress?: string,
    public state?: string,
    public vilage?: string,
    public lga?: string,
    public primarySchool?: string,
    public secondarySchool?: string,
    public tertiary?: string,
    public currentAddress?: string,
    public postalCode?: string,
    public posts?: Resource[],
    public images?: Resource[],
    public audios?: Resource[],
    public videos?: Resource[]
  ) {}
}
