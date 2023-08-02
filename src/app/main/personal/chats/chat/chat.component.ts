import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Chat } from '../chat.model';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      this.chatService.getChat2(this.userId).subscribe((chat) => {
        this.chatDetails = chat;
      });
    });

    this.chatService.chatChanged.subscribe((chat) => {
      chat.sentByUser = false;
      this.chatDetails = [...this.chatDetails, chat];

      // to modify the LHS with the recent chat
      this.chatService.getChats();
    });

    this.route.queryParams.subscribe((params) => {
      this.to = params.firstName;
    });
  }

  chatDetails: Chat[];
  userId: string;
  to: string;
  @ViewChild('message') message: ElementRef;

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
