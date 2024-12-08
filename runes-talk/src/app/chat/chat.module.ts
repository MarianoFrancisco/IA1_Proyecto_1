import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputMessageComponent } from './components/input-message/input-message.component';
import { ChatLayoutComponent } from './layouts/chat-layout/chat-layout.component';
import { MessageComponent } from './components/message/message.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InputMessageComponent,
    ChatLayoutComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule
  ],
  exports: [
    ChatLayoutComponent
  ]
})
export class ChatModule { }
