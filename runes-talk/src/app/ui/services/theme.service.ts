import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _isDarkTheme = signal<boolean>(true);

  public themeLink?: HTMLLinkElement; 
  public isDarkTheme = computed(() => this._isDarkTheme());
  public themeIcon = computed(() => {
    if (this._isDarkTheme()) return 'pi pi-sun';
    return 'pi pi-moon'
  });
  public themeToolTip = computed(() => {
    if (this._isDarkTheme()) return 'Modo Claro';
    return 'Modo Oscuro'
  });


  constructor() {
    this.themeLink = document.getElementById('app-theme') as HTMLLinkElement;
  }

  private changeTheme(): void {
    if (this.themeLink) {
      const theme: string = this._isDarkTheme() ? 'dark' : 'light';
      this.themeLink.href = `${theme}-theme.css`;
    }
  }

  public toggleTheme(): void {
    this._isDarkTheme.set(!this._isDarkTheme());
    localStorage.setItem('theme', this._isDarkTheme() ? 'dark' : 'light');
    this.changeTheme();
  }

  public loadUserTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this._isDarkTheme.set(savedTheme === 'dark');
      this.changeTheme();
    }
  }

}
