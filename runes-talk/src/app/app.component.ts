import { Component, inject } from '@angular/core';
import { ThemeService } from './ui/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private themeService = inject(ThemeService)
  constructor(){
    this.themeService.loadUserTheme();
  }
}
