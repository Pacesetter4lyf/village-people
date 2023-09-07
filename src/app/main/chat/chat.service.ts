import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IndividualService } from '../personal/individual.service';
import { Chat, ChatParent } from './chat.model';


@Injectable({ providedIn: 'root' })
export class ChatService {
  chats: ChatParent[];
  chatsChanged = new Subject<ChatParent[]>();
  chatChanged = new Subject<Chat>();
  userId = new Subject<string>();
  newChatIdAndName = new Subject<{ id: string; name: string; chat: Chat[] }>();

  constructor(
    private individualService: IndividualService,
  ) {
    this.individualService.actualUser.pipe().subscribe((user) => {
      if (user) {
        this.userId.next(user?._id);
        // console.log('sd', user?._id);
      } else {
        this.userId.next(null);
      }
    });
  }

}
