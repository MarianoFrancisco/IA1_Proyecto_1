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
    const newMessage: Message = { isOutgoing: true, text };
    this._messagesArray.update((value) => [...value, newMessage]);
    const intencion = this.chatbotService.predecirIntencion(text);
    const respuesta = this.respuestaPorIntencion(intencion);
    setTimeout(() => {
      const incomingMessage: Message = { isOutgoing: false, text: respuesta };
      this._messagesArray.update((value) => [...value, incomingMessage]);
    }, 2000);
  }

  public setIsLoading(value: boolean) {
    this._isLoading.set(value);
  }

  private respuestaPorIntencion(intencion: string): string {
    switch (intencion) {
      case 'saludo':
        return '¡Hola! ¿En qué puedo ayudarte?';
      case 'despedida':
        return '¡Adiós! Que tengas un buen día.';
      case 'preguntar_hora':
        return 'No tengo un reloj interno, lo siento.';
      default:
        return 'No estoy seguro de cómo responder a eso.';
    }
  }

  public cleanConversation(): void {
    this._messagesArray.set([]);
  }

  public async initializeChatbot() {
    await this.chatbotService.trainModel();
  }

}
