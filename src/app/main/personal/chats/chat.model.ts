import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Chat {
  constructor(
    public from: string,
    public to: string,
    public message: string,
    public createdAt: Date,
    public sentByUser: Boolean
  ) {}
}

@Injectable({ providedIn: 'root' })
export class ChatParent {
  constructor(
    public name: string,
    public lastMessage: string,
    public lastMessageBy: string,
    public lastMessageDate: Date,
    public to: string
  ) {}
}
