import { Component } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { ViewerService } from '../Services/viewer.service';
declare const Autodesk: any;

@Component({
  selector: 'app-mainviewerscreen',
  standalone: true,
  imports: [],
  templateUrl: './mainviewerscreen.component.html',
  styleUrl: './mainviewerscreen.component.css'
})
export class MainviewerscreenComponent {

  forgeViewer: any;
  token:any;
  constructor(private autodeskAuthService:AuthService, private viewer:ViewerService ){}

  ngOnInit(): void {
    this.functionCall();
    
  
  }

  functionCall() {
    this.autodeskAuthService.generateToken().subscribe(
      (response) => {
        this.token=JSON.parse(response.body)['access_token'];
        console.log(JSON.parse(response.body)['access_token']);
        console.log('viewer oninit called!!');
        const viewerDiv = document.getElementById('forgeViewer');
        this.viewer.initViewer(viewerDiv,this.token);
        // Handle the token response as needed
      },
      (error) => {
        console.error('Token Error:', error);
        // Handle errors if any
      }
    );
    }
  

}
