import { Component, ElementRef, ViewChild } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from '../personal/chats/chat.service';
import { Chat, ChatParent } from '../personal/chats/chat.model';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-chat-small',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatSmallComponent {
  faCoffee = faCoffee;
  expanded: boolean = false;
  isInActualChat: boolean = false;

  // actual chat variables
  chatDetails: Chat[];
  userId: string;
  to: string;
  @ViewChild('message') message: ElementRef;
  name: string;

  topClicked() {
    this.expanded = !this.expanded;
  }

  chatParents: ChatParent[];

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.chatService.getChats();
    this.chatService.chatsChanged.subscribe((chatParents) => {
      this.chatParents = chatParents;
      console.log(chatParents);
      if (this.chatParents[0]) {
        // this.viewChat(this.chatParents[0]?.to);
      }
    });

    // from the single chat.
    this.chatService.chatChanged.subscribe((chat) => {
      chat.sentByUser = true;
      this.chatDetails = [...this.chatDetails, chat];

      // to modify the LHS with the recent chat
      this.chatService.getChats();
    });

    // added to single chat to start new chats\
    this.chatService.newChatIdAndName.subscribe((idNameChat) => {
      this.isInActualChat = true;
      this.expanded = true;

      this.userId = idNameChat.id;
      this.name = idNameChat.name;
      this.chatDetails = idNameChat.chat;
    });
  }

  viewChat(id: string) {
    this.isInActualChat = true;
    this.userId = id;

    this.name = this.chatService.getParent(id).name;
    // modification
    this.chatService
      .getChat2(id)
      .pipe(take(1))
      .subscribe((chat) => {
        this.chatDetails = chat;
      });
  }
  back() {
    this.isInActualChat = false;
  }
  // child component begins
  sendMessage() {
    // check that the user i am sending to isnt deleted: replicate this in the backend
    const chatParent = this.chatService.getParent(this.userId);
    if (chatParent?.name === 'deleted user') {
      alert('user has been deleted');
      return;
    }

    let value = this.message.nativeElement.value;
    let to = this.userId;
    let message = { to: to, message: value };
    if (value.length < 2) return;
    this.chatService.sendMessage(message);
    this.message.nativeElement.value = '';
  }
}
