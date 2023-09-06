export class Chat {
  constructor(
    public from: string,
    public to: string,
    public message: string,
    public createdAt: Date,
    public sentByUser: Boolean
  ) {}
}

export class ChatParent {
  constructor(
    public name: string,
    public lastMessage: string,
    public lastMessageBy: string,
    public lastMessageDate: Date,
    public to: string
  ) {}
}
