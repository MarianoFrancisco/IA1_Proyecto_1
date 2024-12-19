import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'ui-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styles: ``
})
export class ThemeSwitcherComponent {

  private themeService = inject(ThemeService);

  public themeIcon = computed(() => this.themeService.themeIcon());

  public themeToolTip = computed(() => this.themeService.themeToolTip());

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }

}
