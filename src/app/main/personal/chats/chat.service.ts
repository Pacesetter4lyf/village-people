import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
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
  chatsChanged = new Subject<ChatParent[]>();
  chatChanged = new Subject<Chat>();
  userId: string;
  newChatIdAndName = new Subject<{ id: string; name: string; chat: Chat[] }>();

  constructor(
    private http: HttpClient,
    private individualService: IndividualService
  ) {
    this.getChats();

    this.individualService.actualUser.subscribe((user) => {
      this.userId = user._id;
      console.log('sd', this.userId);
    });
  }

  getChats() {
    // if chats, return it else fetch it, save it and return it
    this.http
      .get<GetChatsI<ChatParent[]>>(`http://localhost:3001/api/v1/chat/`)
      .subscribe((resp) => {
        this.chats = resp.data.data;
        this.chatsChanged.next(this.chats);
      });
  }

  getParent(to: string) {
    return this.chats.find((ch) => ch.to === to);
  }

  getChat2(id: string) {
    // if chats, return it else fetch it, save it and return it
    return this.http
      .get<GetChatsI<Chat[]>>(`http://localhost:3001/api/v1/chat/${id}`)
      .pipe(
        map((response) => {
          console.log(response);
          return response.data.data;
        })
      );
  }
  sendMessage(message: { to: string; message: string }) {
    let from = this.individualService.actualUser.value._id;
    let userMessage = { ...message, from };
    this.http
      .post<GetChatsI<Chat>>(`http://localhost:3001/api/v1/chat/`, {
        ...userMessage,
      })
      .subscribe((resp) => {
        if (resp.status === 'success') {
          this.chatChanged.next(resp.data.data);
          console.log(resp.data.data);
        }
      });
  }

  triggerChat(id: string, name: string) {
    this.getChat2(id).subscribe((chat) => {
      if (!chat || !chat.length) {
        chat = [];
      }
      this.newChatIdAndName.next({ id, name, chat });
    });
  }
}
