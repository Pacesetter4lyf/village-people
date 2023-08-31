type dependentType = {
  _id: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
};

export interface TreeInterface {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  bibliography: string;
  father: string;
  mother: string;
  createdBy: string;
  userId: string;
  child: dependentType[];
  husbands: dependentType[];
  wives: dependentType[];
  sibling: dependentType[];
}

export class TreeModel implements TreeInterface {
  constructor(
    public _id: string,
    public firstName: string,
    public lastName: string,
    public gender: string,
    public bibliography: string,
    public father: string,
    public mother: string,
    public createdBy: string,
    public userId: string,
    public sibling: dependentType[],
    public husbands: dependentType[],
    public wives: dependentType[],
    public child: dependentType[]
  ) {}
}
