export interface BasicDetailsInterface {
  _id?: string;
  photo?: string | File;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  facebook?: string;
  address?: string;
  primarySchool?: string;
  secondarySchool?: string;
  tertiarySchool?: string;
  bibliography?: string;
  primary?: string;
  secondary?: string;
  tertiary?: string;
  createdBy?: string;
  lineage?: string[];
  adminOf?: number[];
}
// interface BasicDetailsInterface Individual
export class Individual implements BasicDetailsInterface {
  constructor(
    public _id: string = '',
    public id: string = '',
    public firstName: string = '',
    public lastName: string = '',
    public photo: string | File = 'undefined',
    public nickname: string = '',
    public dateOfBirth: string = '',
    public phoneNumber: string = '',
    public email: string = '',
    public description: string = '',
    public countryOfBirth: string = '',
    public gender: 'male' | 'female' | 'other' = 'male',
    public appendedTo: string = '',
    public appendedAs: string = '',
    public image: string = '',
    public createdBy: string = '',

    public editableBy: string = '',
    public facebookAddress: string = '',
    public address: string = '',
    public facebook: string = '',
    public bibliography: string = '',
    public state: string = '',
    public vilage: string = '',
    public lga: string = '',
    public primarySchool: string = '',
    public secondarySchool: string = '',
    public tertiarySchool: string = '',
    public tertiary: string = '',
    public currentAddress: string = '',
    public postalCode: string = '',
    public lineage: string[] = [],
    public adminOf: number[] = []
  ) {}
}

// _id?: string;
// photo?: string | File;
// firstName?: string;
// lastName?: string;
// gender?: string;
// dateOfBirth?: string;
// phoneNumber?: string;
// facebook?: string;
// address?: string;
// primarySchool?: string;
// secondarySchool?: string;
// tertiarySchool?: string;
// bibliography?: string;
// primary?: string;
// secondary?: string;
// tertiary?: string;
// createdBy?: string;
// lineage?: string[];
// adminOf?: number[];
