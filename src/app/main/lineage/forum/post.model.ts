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
}

export class PostModel implements CommentFieldsInterface {
  poster: {
    firstName: string;
    id: string;
    adminableBy?: string[];
    lineage?: number[];
  };

  constructor(
    public id: string = '',
    public isCommentsTurnedOff: boolean = false,
    public file: string | File = '',
    public isForPerson: boolean = false,
    public personId: string = '',
    public postBox: string = '',
    public isNotVisibleByLineage: boolean = false,
    public isLineageResource : boolean = false,
    public title: string = '',
    public likes: string[] = [],
    public dateCreated = new Date(),
    public comments: {
      userId: {
        id: string;
        firstName: string;
      };
      date: Date;
      comment: string;
      likes: string[];
    }[] = null
  ) {
    this.poster = {
      firstName: '',
      id: '',
      adminableBy: [],
      lineage: [],
    };
  }
}
