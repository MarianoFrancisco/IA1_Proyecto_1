import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../interfaces/message.interface';
import { ChatService } from '../../services/chat.service';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'chat-layout',
  templateUrl: './chat-layout.component.html',
  styles: ``
})
export class ChatLayoutComponent implements OnInit {

  private chatService = inject(ChatService);

  public isLoading = computed(() => this.chatService.isLoading());
  public model = computed(() => this.chatService.model());
  public messageArray = computed(() => this.chatService.messagesArray());

  constructor() { }

  ngOnInit(): void {
    this.chatService.initializeChatbot();
  }

}
