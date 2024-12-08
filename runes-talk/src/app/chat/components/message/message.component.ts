import { Component, inject, Input, OnInit } from '@angular/core';
import { Message } from '../../interfaces/message.interface';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'chat-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {

  @Input({ required: true }) public message!: Message;

  private chatService = inject(ChatService);

  public displayText: string = '';
  
  constructor() { }

  ngOnInit(): void {
    if (this.message.isOutgoing) {
      this.displayText = this.message.text;
    } else {
      this.typeText();
    }
  }

  private typeText(): void {
    let i: number = 0;
    const interval = setInterval(() => {
      if (i < this.message.text.length) {
        this.displayText += this.message.text.charAt(i);
        i++;
      } else {
        this.chatService.setIsLoading(false);
        clearInterval(interval);
      }
    }, 25)
  }

}
