import { computed, Injectable, signal, inject } from '@angular/core';
import { Message } from '../interfaces/message.interface';
import { ChatbotService } from './chatbot.service'; // Asegúrate que la ruta es correcta

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private _isLoading = signal<boolean>(false);
  private _messagesArray = signal<Message[]>([]);

  public isLoading = computed(() => this._isLoading());
  public messagesArray = computed(() => this._messagesArray());

  // Inyectamos el ChatbotService
  private chatbotService = inject(ChatbotService);

  constructor() { }

  public async createInComingMessage(text: string): Promise<void> {
    const newMessage: Message = { isOutgoing: true, text };
    this._messagesArray.update((value) => [...value, newMessage]);

    // Predecir intención
    const intencion = this.chatbotService.predecirIntencion(text);
    const respuesta = this.respuestaPorIntencion(intencion);

    // Simular un pequeño delay para respuesta (opcional)
    setTimeout(() => {
      const incomingMessage: Message = { isOutgoing: false, text: respuesta };
      this._messagesArray.update((value) => [...value, incomingMessage]);
    }, 1000);
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

  // Método para inicializar el chatbot (entrenar el modelo)
  public async initializeChatbot() {
    await this.chatbotService.entrenarModelo();
  }
}
