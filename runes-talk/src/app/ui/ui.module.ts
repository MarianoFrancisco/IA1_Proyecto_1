import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@NgModule({
  declarations: [
    ToolbarComponent,
    ThemeSwitcherComponent,
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  exports: [
    ToolbarComponent
  ]
})
export class UiModule { }
