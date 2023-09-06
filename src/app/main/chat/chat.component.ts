import { Component, ElementRef, ViewChild } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from './chat.service';
import { Chat, ChatParent } from './chat.model';
import { take, Subscription } from 'rxjs';
import * as fromApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import * as ChatActions from './store/chat.actions';

@Component({
  selector: 'app-chat-small',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatSmallComponent {
  expanded: boolean = false;
  isInActualChat: boolean = false;
  actualUserId: string;
  // actual chat variables
  chatParents: ChatParent[];
  chatDetails: Chat[];
  userId: string;
  name: string;
  @ViewChild('message') message: ElementRef;
  storeSub: Subscription;

  constructor(
    private chatService: ChatService,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnInit() {
    this.store.dispatch(new ChatActions.GetChatList());
    this.storeSub = this.store.select('chat').subscribe((chat) => {
      this.chatParents = chat.chatList;
      this.expanded = chat.expanded;
      this.isInActualChat = chat.isInActualChat;
      this.chatDetails = chat.chats;
      this.userId = chat.chatRecipientId;
      this.name = chat.chatRecipientName;
    });

    this.chatService.userId.subscribe(
      (actualUser) => (this.actualUserId = actualUser)
    );
  }

  topClicked() {
    if (this.expanded) {
      this.store.dispatch(new ChatActions.MinimizeChat());
    } else {
      this.store.dispatch(new ChatActions.OpenChatUi());
    }
  }

  viewChat(id: string, name: string) {
    this.store.dispatch(
      new ChatActions.ConversationOpenInitiated({ id, name })
    );
  }

  back() {
    this.store.dispatch(new ChatActions.GoBack());
  }

  // child component begins
  sendMessage() {
    // check that the user i am sending to isnt deleted: replicate this in the backend
    const chatParent = this.chatParents.find((ch) => ch.to === this.userId);
    if (chatParent?.name === 'deleted user') {
      alert('user has been deleted');
      return;
    }
    let value = this.message.nativeElement.value;
    let to = this.userId;
    let message = { to: to, message: value };
    if (value.length < 2) return;
    this.store.dispatch(new ChatActions.SendMessage(message));
    this.message.nativeElement.value = '';
  }
}
