import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { LeftpanelComponent } from './leftpanel/leftpanel.component';
import { FooterComponent } from './footer/footer.component';
import { MainviewerscreenComponent } from './mainviewerscreen/mainviewerscreen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    NavbarComponent,
    LeftpanelComponent,
    FooterComponent,
    MainviewerscreenComponent,
  ],
})
export class AppComponent {
  title = 'Viewer3D';
}
