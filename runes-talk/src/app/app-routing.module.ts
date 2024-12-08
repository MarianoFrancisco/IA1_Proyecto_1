import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatLayoutComponent } from './chat/layouts/chat-layout/chat-layout.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ChatLayoutComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
