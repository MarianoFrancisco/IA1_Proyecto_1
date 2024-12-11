import { Component, computed, inject, signal } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../ui/services/toast.service';

@Component({
  selector: 'chat-input-message',
  templateUrl: './input-message.component.html',
  styles: ``
})
export class InputMessageComponent {

  private formBuilder = inject(FormBuilder);
  private chatService = inject(ChatService);
  private toastService = inject(ToastService);

  public isLoading = computed(() => this.chatService.isLoading());
  public chatForm: FormGroup = this.formBuilder.group({
    inputText: ['', [Validators.required, Validators.minLength(1)]]
  });

  constructor () { }

  public sendMessage(): void {
    if (this.chatForm.invalid) {
      this.toastService.showError('Por favor ingresa una pregunta...');
    } else {
      this.chatService.setIsLoading(true);
      const { inputText } = this.chatForm.value;
      this.chatService.createInComingMessage(inputText);
      this.chatForm.reset();
    }
  }

  public onClearConversation(): void {
    this.chatService.cleanConversation();
  }

}
