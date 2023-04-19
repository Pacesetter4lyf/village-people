import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Chat, ChatParent } from './chat.model';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css'],
})
export class ChatsComponent implements OnInit {
  chatDetails: Chat[];
  chatParents: ChatParent[];
  @ViewChild('message') message: ElementRef;
  // @ViewChild('child', { static: true }) childComponentRef: ElementRef;
  activatedRecipient: string;

  constructor(private chatService: ChatService) {}
  ngOnInit() {
    this.chatService.getChats();
    this.chatService.chatsChanged.subscribe((chatParents) => {
      this.chatParents = chatParents;
      if (this.chatParents[0]) {
        // this.viewChat(this.chatParents[0]?.to);
      }
      // console.log('chats ', this.chatParents);
    });

    this.chatService.chatChanged.subscribe((chatDetails) => {
      this.chatDetails = chatDetails;

      // console.log('details ', this.chatDetails);
    });
  }

  viewChat(id: string) {
    this.activatedRecipient = id;
    this.chatService.getChat(id);
  }

  sendMessage() {
    let value = this.message.nativeElement.value;
    let to = this.activatedRecipient;
    let message = { to: to, message: value };
    if (value.length < 2) return;
    this.chatService.sendMessage(message);
    this.message.nativeElement.value = '';
  }
}
