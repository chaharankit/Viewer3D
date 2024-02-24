import { Component, OnDestroy } from '@angular/core';
import { ButtonClickService } from '../Services/button-click.service';
import { Subscription } from 'rxjs';
import { BucketService } from '../Services/bucket.service';
import { AuthService } from '../Services/auth.service';
import { CommonModule } from '@angular/common';
import { ViewerService } from '../Services/viewer.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnDestroy {
  onFileSelected(_t12: any) {
    this.selectedFile = _t12.objectKey;
    const urn = btoa(_t12['objectId']);
    console.log(urn);
    this.viewer.loadModel(this.viewer.forgeViewer, urn);
  }
  messageobj = { message: '', origin: '' };
  private subscription: Subscription;
  selectedFile: any = 'Select A File';
  authtoken: string = '';
  objectList: any;
  constructor(
    private sharedService: ButtonClickService,
    private bucketService: BucketService,
    private autodeskAuthService: AuthService,
    private viewer: ViewerService
  ) {
    this.subscription = this.sharedService.buttonClick$.subscribe((message) => {
      this.messageobj = message;
      console.log(message);
      this.getToken();
      //alert(message);
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getToken() {
    this.autodeskAuthService.generateToken().subscribe(
      (response) => {
        this.authtoken = JSON.parse(response.body)['access_token'];
        console.log('Token Response:', JSON.parse(response.body));
        // Handle the token response as needed
      },
      (error) => {
        console.error('Token Error:', error);
        // Handle errors if any
      }
    );
    this.bucketService
      .GetBucketItems(this.authtoken, this.messageobj.message)
      .subscribe(
        (response) => {
          this.objectList = response.items;
          console.log(response);
          //alert(response);
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
