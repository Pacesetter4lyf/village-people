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
