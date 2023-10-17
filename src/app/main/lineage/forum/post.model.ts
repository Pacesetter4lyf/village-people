export interface CommentFieldsInterface {
  id: string;
  isCommentsTurnedOff: boolean;
  file: string | File;
  isForPerson: boolean;
  personId: string;
  postBox: string;
  isNotVisibleByLineage: boolean;
  isLineageResource: boolean;
  title: string;
  likes: string[];
  comments: {
    userId: {
      id: string;
      firstName: string;
    };
    date: Date;
    comment: string;
    likes: string[];
  }[];
  poster: {
    firstName: string;
    id: string;
    adminableBy?: string[];
    lineage?: number[];
  };
}

export class PostModel implements CommentFieldsInterface {
  constructor(
    public id: string = '',
    public isCommentsTurnedOff: boolean = false,
    public file: string | File = '',
    public isForPerson: boolean = false,
    public personId: string = '',
    public postBox: string = '',
    public isNotVisibleByLineage: boolean = false,
    public isLineageResource: boolean = false,
    public title: string = '',
    public likes: string[] = [],
    public datePosted = new Date().toString(),
    public comments: {
      userId: {
        id: string;
        firstName: string;
      };
      date: Date;
      comment: string;
      likes: string[];
    }[] = null,
    public poster: {
      firstName: string;
      id: string;
      adminableBy?: string[];
      lineage?: number[];
    } = {
      firstName: '',
      id: '',
      adminableBy: [],
      lineage: [],
    }
  ) {}
}
