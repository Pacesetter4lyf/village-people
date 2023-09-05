import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map, take } from 'rxjs';
import { IndividualService } from '../personal/individual.service';
import { Chat, ChatParent } from './chat.model';

import { environment } from 'src/environments/environment';
const apiUrl = environment.apiUrl;

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
  userId = new Subject<string>();
  newChatIdAndName = new Subject<{ id: string; name: string; chat: Chat[] }>();

  constructor(
    private http: HttpClient,
    private individualService: IndividualService
  ) {
    this.individualService.actualUser.pipe().subscribe((user) => {
      if (user) {
        this.getChats();
        this.userId.next(user?._id);
        console.log('sd', user?._id);
      } else {
        this.userId.next(null);
      }
    });
  }

  getChats() {
    // if chats, return it else fetch it, save it and return it
    this.http
      .get<GetChatsI<ChatParent[]>>(`${apiUrl}/chat/`)
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
    return this.http.get<GetChatsI<Chat[]>>(`${apiUrl}/chat/${id}`).pipe(
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
      .post<GetChatsI<Chat>>(`${apiUrl}/chat/`, {
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
