import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { BucketService } from '../Services/bucket.service';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ViewerService } from '../Services/viewer.service';
import { FormsModule } from '@angular/forms';
import { BucketBody } from '../models/bucket-create';
import { ButtonClickService } from '../Services/button-click.service';
declare const bootstrap: any;
declare const Autodesk: any;

@Component({
  selector: 'app-leftpanel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leftpanel.component.html',
  styleUrl: './leftpanel.component.css',
})
export class LeftpanelComponent implements OnInit {
OnFileSelected($event: any) {
  const selectedFile=$event.target.files[0];
  console.log(selectedFile.name);
}
  UploadToBucket($event: MouseEvent, _t46: any) {
    $event.stopPropagation();
    alert(_t46);
    console.log(_t46);
  }
  DeleteBucket(event: Event, arg0: any) {
    event.stopPropagation();
    this.bucket.DeleteBucket(this.authtoken, arg0).subscribe(
      (response) => {
        //this.objectList = response.items;
        console.log(response);
        this.showToastMessage(`bucket ${arg0} deleted!!`);
        this.functionCall();
        //alert(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  toastMessage: any = '';
  SubmitBucketDetails() {
    this.bucketModel.bucketKey = this.newBucketName;
    this.bucketModel.policyKey = this.newBucketType;
    console.log(JSON.stringify(this.bucketModel));
    if (
      this.newBucketName.length == 0 ||
      this.newBucketName.length <= 3 ||
      this.newBucketName.length >= 128
    ) {
      return;
    }
    this.bucket.CreateBucket(this.authtoken, this.bucketModel).subscribe(
      (response) => {
        //this.objectList = response.items;
        console.log(response);
        this.functionCall();
        //alert(response);
      },
      (error) => {
        //console.error(error);
        if (error['status'] == 409) {
          this.toastMessage = 'Bucket already exists! Please give unique name';
          this.showToastMessage(this.toastMessage);
        }
      }
    );
    //alert(`${this.newBucketName} and ${this.newBucketType}`);
  }
  showToastMessage(message: any) {
    this.toastMessage = message;
    const toast = document.getElementById('my-toast');
    const ShowToast = new bootstrap.Toast(toast);
    ShowToast.show();
  }

  objectList: any | null = null;
  bucketList: any;
  authtoken: any = '';
  newBucketName: string = '';
  newBucketType: string = 'transient';
  bucketModel: BucketBody = new BucketBody();

  /**
   *
   */
  constructor(
    private autodeskAuthService: AuthService,
    private bucket: BucketService,
    private viewer: ViewerService,
    private sharedService:ButtonClickService
  ) {}
  ngOnInit(): void {
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
  }
  @ViewChildren('my-button')
  myButton!: QueryList<ElementRef>;
  viewer3d: any;
  ObjectClicked(vObject: any) {
    //alert(vObject['objectId']);
    const urn = btoa(vObject['objectId']);
    console.log(urn);
    this.viewer.loadModel(this.viewer.forgeViewer, urn);
  }

  GetBucketItems(event: Event, bucketName: string) {
    const message =bucketName;
    const origin ="Hi this is from bucketClicked";
    this.sharedService.notifyButtonClick(message,origin);
    event.stopPropagation();
    this.bucket.GetBucketItems(this.authtoken, bucketName).subscribe(
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
  functionCall() {
    this.autodeskAuthService.generateToken().subscribe(
      (response) => {
        console.log(JSON.parse(response.body)['access_token']);
        this.bucket.GetBucketData(this.authtoken).subscribe(
          (response) => {
            this.bucketList = response.items;
            console.log(response);
            // Handle the token response as needed
          },
          (error) => {
            console.error('Token Error:', error);
            // Handle errors if any
          }
        );
        // Handle the token response as needed
      },
      (error) => {
        console.error('Token Error:', error);
        // Handle errors if any
      }
    );
  }
}
