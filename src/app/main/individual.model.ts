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
    public gender: "male" | "female" | "other",
    public createdBy: string,

    public facebookAddress?: string,
    public state?: string,
    public vilage?: string,
    public lga?: string,
    public primarySchool?: string,
    public secondarySchool?: string,
    public tertiary?: string,
    public currentAddress?: string,
    public postalCode?: string,

  ) {}
}
