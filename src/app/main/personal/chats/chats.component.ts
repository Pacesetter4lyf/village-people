import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Chat, ChatParent } from './chat.model';
import { ChatService } from './chat.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css'],
})
export class ChatsComponent implements OnInit {
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
  }

  viewChat(id: string) {
    const firstName = this.chatService.getParent(id).name;
    this.router.navigate(['.', id], {
      relativeTo: this.route,
      queryParams: { firstName },
    });
  }
}
