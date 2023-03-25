export class Resource {
  constructor(
    public nameortitle: string,
    public urlorcontent: string,
    public description?: string,
    public viewable: 'self' | 'lineage' | 'all' = 'self',
    public publicUrl?: string
  ) {}
}
