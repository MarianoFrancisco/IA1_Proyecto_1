import { computed, inject, Injectable, signal } from '@angular/core';
import { Message } from '../interfaces/message.interface';
import { ChatbotService } from './chatbot.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatbotService = inject(ChatbotService);

  private _messagesArray = signal<Message[]>([]);

  public isLoading = signal<boolean>(false);
  public model = computed(() => this.chatbotService.model());
  public messagesArray = computed(() => this._messagesArray());

  constructor() { }

  public createInComingMessage(text: string): void {
    const userMessage: Message = { isOutgoing: true, text };
    this._messagesArray.update((value) => [...value, userMessage]);
    this.isLoading.set(true);
    this.chatbotService.predictIntent(text).subscribe({
      next: (message) => {
        // setTimeout(() => {
      //   const botMessage: Message = { isOutgoing: false, text: res };
      //   this._messagesArray.update((value) => [...value, botMessage]);
      // }, 2000);
        const botMessage: Message = { isOutgoing: false, text: message };
        this._messagesArray.update((value) => [...value, botMessage]);
      },
      error: (error) => console.log(error)
    });
  }

  public setIsLoading() {
    this.isLoading.set(false);
  }

  public cleanConversation(): void {
    this._messagesArray.set([]);
  }

  public initializeChatbot() {
    return this.chatbotService.loadResources().subscribe();
  }

}
