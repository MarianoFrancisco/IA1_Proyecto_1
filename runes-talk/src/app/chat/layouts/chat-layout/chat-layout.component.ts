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
  private chatbotService = inject(ChatbotService);

  public trained = computed(() => this.chatbotService.entrenado());

  public messageArray = computed(() => this.chatService.messagesArray());

  async ngOnInit(): Promise<void> {
    await this.chatService.initializeChatbot();
  }


}
