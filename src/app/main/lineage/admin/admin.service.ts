export interface personRowInterface {
  id: string;
  firstName: string;
  lastName: string;
  mother: string;
  father: string;
  wife: string;
  husband: string;
  lineage: number[];
  status: string;
  // user: boolean | string;
}

export class PersonRowClass implements personRowInterface {
  constructor(
    public id = '',
    public firstName = '',
    public lastName = '',
    public mother = '',
    public father = '',
    public wife = '',
    public husband = '',
    public lineage = [1234],
    public status = 'active'
  ) {}
}
export interface codeRowInterface {
  id: string;
  nodeTo: {
    id: string;
    firstName: string;
    lastName: string;
    mother?: {
      firstname: string;
      lastName: string;
    };
    father?: {
      firstname: string;
      lastName: string;
    };
  };
  generatedBy: string;
  sentBy: string;
  mode: string;
  code: string;
  status: string;
  userData: {
    id: string;
    firstName: string;
    lastName: string;
    mother?: {
      firstname: string;
      lastName: string;
    };
    father?: {
      firstname: string;
      lastName: string;
    };
  };
}
