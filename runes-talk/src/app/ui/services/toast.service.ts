import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private messageService = inject(MessageService);

  constructor() { }

  public showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Fecilidades', detail });
  }

  public showInfo(detail: string): void {
    this.messageService.add({ severity: 'info', summary: 'Información', detail });
  }

  public showWarn(detail: string): void {
    this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail });
  }

  public showError(detail: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }

  public showContrast(summary: string, detail: string) {
    this.messageService.add({ severity: 'contrast', summary, detail });
  }

  public showSecondary(summary: string, detail: string) {
    this.messageService.add({ severity: 'contrast', summary, detail });
  }

}
