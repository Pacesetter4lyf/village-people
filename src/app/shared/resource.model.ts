export class Resource {
  constructor(
    public user:
      | string
      | {
          firstName: string;
          lastName: string;
        },
    public resourceType: 'image' | 'text' | 'audio' | 'video' | '',
    public _id?: string,
    public viewableBy?: string,
    public description?: string,
    public name?: string,
    public text?: string,
    public url?: string,
    public forUser?: string
  ) {}
}
