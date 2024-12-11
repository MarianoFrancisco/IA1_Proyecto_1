import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../interfaces/message.interface';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'chat-layout',
  templateUrl: './chat-layout.component.html',
  styles: ``
})
export class ChatLayoutComponent implements OnInit {

  private chatService = inject(ChatService);

  public messageArray = computed(() => this.chatService.messagesArray());

  async ngOnInit(): Promise<void> {
    await this.chatService.initializeChatbot();
  }


}
