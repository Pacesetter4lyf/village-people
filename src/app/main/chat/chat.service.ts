import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map, take } from 'rxjs';
import { IndividualService } from '../personal/individual.service';
import { Chat, ChatParent } from './chat.model';
import { environment } from 'src/environments/environment';
import * as fromApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';

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
    private individualService: IndividualService,
    private store: Store<fromApp.AppState>
  ) {
    this.individualService.actualUser.pipe().subscribe((user) => {
      if (user) {
        this.userId.next(user?._id);
        console.log('sd', user?._id);
      } else {
        this.userId.next(null);
      }
    });
  }

}
