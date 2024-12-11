import { computed, inject, Injectable, signal } from '@angular/core';
import { Message } from '../interfaces/message.interface';
import { ChatbotService } from './chatbot.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatbotService = inject(ChatbotService);

  private _isLoading = signal<boolean>(false);
  private _messagesArray = signal<Message[]>([]);

  public isLoading = computed(() => this._isLoading());
  public messagesArray = computed(() => this._messagesArray());

  constructor() { }

  public createInComingMessage(text: string): void {
    // Mensaje del usuario
    const userMessage: Message = { isOutgoing: true, text };
    this._messagesArray.update((value) => [...value, userMessage]);

    // Predecir intención
    const intencion = this.chatbotService.predecirIntencion(text);
    // Obtener respuesta aleatoria desde el servicio
    const respuesta = this.chatbotService.getResponseForIntent(intencion);

    // Agregar respuesta del bot tras un pequeño delay (simulación)
    setTimeout(() => {
      const botMessage: Message = { isOutgoing: false, text: respuesta };
      this._messagesArray.update((value) => [...value, botMessage]);
    }, 2000);
  }

  public setIsLoading(value: boolean) {
    this._isLoading.set(value);
  }

  public cleanConversation(): void {
    this._messagesArray.set([]);
  }

  public async initializeChatbot() {
    await this.chatbotService.trainModel();
  }

}
