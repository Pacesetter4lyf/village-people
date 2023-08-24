import { ResourceLoader } from '@angular/compiler';
import { Resource } from '../../../../src/app/shared/resource.model';

interface DisplayUserInterface {
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
  lineage?: string[];
  primary?: string;
  secondary?: string;
  tertiary?: string;
}

export class DisplayUserModel implements DisplayUserInterface {
  constructor(
    public _id?: string,
    public photo?: string | File,
    public firstName?: string,
    public lastName?: string,
    public gender?: string,
    public dateOfBirth?: string,
    public phoneNumber?: string,
    public facebook?: string,
    public address?: string,
    public primarySchool?: string,
    public secondarySchool?: string,
    public tertiarySchool?: string,
    public bibliography?: string,
    public lineage?: string[],
    public primary?: string,
    public secondary?: string,
    public tertiary?: string,
    public resource?: Resource[],
    public adminOf?: number[]
  ) {}
}
