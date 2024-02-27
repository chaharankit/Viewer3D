import { Component, OnDestroy } from '@angular/core';
import { ButtonClickService } from '../Services/button-click.service';
import { Subscription } from 'rxjs';
import { BucketService } from '../Services/bucket.service';
import { AuthService } from '../Services/auth.service';
import { CommonModule } from '@angular/common';
import { ViewerService } from '../Services/viewer.service';
import { UploadfileService } from '../Services/uploadfile.service';
import { UploadKey } from '../models/bucket-create';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnDestroy {
  isClassRemoved: boolean = false;
  keyPressed($event: KeyboardEvent) {
    console.log($event);
  }
  messageobj = { message: '', origin: '' };
  private subscription: Subscription;
  selectedFile: any = 'Select A File';
  authtoken: string = '';
  objectList: any;
  newFileForUpload: any;
  _uploadKey: UploadKey = new UploadKey();
  uploadUrl: string = '';
  intervalId: any;
  uploadedFileUrn: string = '';
  jobStatus: any;
  jobProgress: any;
  constructor(
    private sharedService: ButtonClickService,
    private bucketService: BucketService,
    private autodeskAuthService: AuthService,
    private viewer: ViewerService,
    private fileService: UploadfileService
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
  uploadFileClicked() {
    this.isClassRemoved=true;
    this.fileService
      .UploadFileOnUrl(this.newFileForUpload, this.uploadUrl)
      .subscribe(
        (response) => {
          console.log(response);
          this.fileService
            .CompleteUploadOfFile(
              this.messageobj.message,
              this.newFileForUpload.name,
              this._uploadKey.uploadKey,
              this.authtoken
            )
            .subscribe(
              (response) => {
                console.log(response);
                console.log(btoa(response.objectId));
                this.uploadedFileUrn = btoa(response.objectId);
                console.log(this.authtoken);
                this.fileService
                  .StartTranslationOfFile(
                    btoa(response.objectId),
                    this.authtoken
                  )
                  .subscribe(
                    (response) => {
                      console.log(response);
                      this.intervalId = setInterval(() => {
                        if (this.CheckRequirement()) {
                          //alert('file ready for viewing');
                          this.stopInterval();
                          this.isClassRemoved=false;
                        } else {
                          this.fileService
                            .CheckManifest(this.uploadedFileUrn, this.authtoken)
                            .subscribe(
                              (response) => {
                                console.log(response);
                                this.jobStatus = response.status;
                                this.jobProgress = response.progress;
                              },
                              (error) => {
                                console.log(error);
                              }
                            );
                        }
                      }, 2000);
                    },
                    (error) => {
                      console.log(error);
                    }
                  );
              },
              (error) => {
                console.error(error);
              }
            );
        },
        (error) => {
          console.error(error);
        }
      );
  }
  stopInterval() {
    clearInterval(this.intervalId);
  }
  CheckRequirement(): boolean {
    if (this.jobStatus == 'success' && this.jobProgress == 'complete') {
      return true;
    }
    return false;
  }
  onUploadFileSelected($event: any) {
    this.newFileForUpload = $event.target.files[0];
    console.log(this.newFileForUpload);
    this.fileService
      .GenerateUploadUrl(
        this.messageobj.message,
        this.newFileForUpload?.name,
        this.authtoken
      )
      .subscribe(
        (response) => {
          console.log(response);
          this._uploadKey.uploadKey = response.uploadKey;
          this.uploadUrl = response.urls[0];
        },
        (error) => {
          console.error(error);
        }
      );
  }
  onFileSelected(_t12: any) {
    this.selectedFile = _t12.objectKey;
    const urn = btoa(_t12['objectId']);
    console.log(urn);
    this.viewer.loadModel(this.viewer.forgeViewer, urn);
  }
}
