export class Chat {
  constructor(
    public from: string,
    public to: string,
    public message: string,
    public createdAt: string,
    public sentByUser: Boolean
  ) {}
}

export class ChatParent {
  constructor(
    public name: string,
    public lastMessage: string,
    public lastMessageBy: string,
    public lastMessageDate: string,
    public to: string
  ) {}
}
