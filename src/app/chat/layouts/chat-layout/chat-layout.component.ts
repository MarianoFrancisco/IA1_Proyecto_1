import { Component, computed, inject, ViewChild } from '@angular/core';
import { Message } from '../../interfaces/message.interface';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'chat-layout',
  templateUrl: './chat-layout.component.html',
  styles: ``
})
export class ChatLayoutComponent {

  private chatService = inject(ChatService);

  public messageArray = computed(() => this.chatService.messagesArray());

}
