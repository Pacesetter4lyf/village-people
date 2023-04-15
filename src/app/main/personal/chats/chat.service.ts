import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IndividualService } from '../individual.service';
import { Chat, ChatParent } from './chat.model';

export interface GetChatsI<T> {
  data: {
    data?: T;
  };
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  chats: ChatParent[];
  chat: Chat[];
  chatsChanged = new Subject<ChatParent[]>();
  chatChanged = new Subject<Chat[]>();

  constructor(
    private http: HttpClient,
    private individualService: IndividualService
  ) {}

  getChats() {
    // if chats, return it else fetch it, save it and return it
    this.http
      .get<GetChatsI<ChatParent[]>>(`http://localhost:3001/api/v1/chat/`)
      .subscribe((resp) => {
        this.chats = resp.data.data;
        this.chatsChanged.next(this.chats);
      });
  }

  getChat(id: string) {
    this.http
      .get<GetChatsI<Chat[]>>(`http://localhost:3001/api/v1/chat/${id}`)
      .subscribe((resp) => {
        this.chat = resp.data.data;
        this.chatChanged.next(this.chat);
      });
  }

  sendMessage(message: { to: string; message: string }) {
    let from = this.individualService.displayUser.value._id;
    let userMessage = { ...message, from };
    this.http
      .post<GetChatsI<Chat>>(`http://localhost:3001/api/v1/chat/`, {
        ...userMessage,
      })
      .subscribe((resp) => {
        if (resp.status === 'success') {
          this.chat = [...this.chat, resp.data.data];
          this.chatChanged.next(this.chat);
          console.log(this.chat);
        }
      });
  }
}
