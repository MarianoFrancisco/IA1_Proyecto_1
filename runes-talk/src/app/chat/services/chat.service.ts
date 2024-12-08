import { computed, Injectable, signal } from '@angular/core';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private _isLoading = signal<boolean>(false);
  private _messagesArray = signal<Message[]>([]);

  public isLoading = computed(() => this._isLoading());
  public messagesArray = computed(() => this._messagesArray());

  constructor() { }

  public createInComingMessage(text: string): void {
    const newMessage: Message = { isOutgoing: true, text };
    this._messagesArray.update((value) => [...value, newMessage]);
    setTimeout(() => {
      const newMessage: Message = { isOutgoing: false, text };
      this._messagesArray.update((value) => [...value, newMessage]);
    }, 2000);
  }

  public setIsLoading(value: boolean) {
    this._isLoading.set(value);
  }

}
