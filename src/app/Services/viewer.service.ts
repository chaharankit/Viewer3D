import { Injectable } from '@angular/core';
declare const Autodesk: any;
declare var window: any;
@Injectable({
  providedIn: 'root',
})
export class ViewerService {
  forgeViewer: any;
  //token:any;
  constructor() {}

  async initViewer(container: any, token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        env: 'AutodeskProduction',
        api: 'streamingV2',
        getAccessToken: () => {
          return token;
        },
      };

      Autodesk.Viewing.Initializer(options, () => {
        const config = {
          extensions: [
            'Autodesk.DocumentBrowser',
            'SampleExtension',
            'DemoMenuExtension',
            'DemoMenuExtension2',
          ],

          loaderExtensions: { svf: 'Autodesk.MemoryLimited' },
        };

        this.forgeViewer = new Autodesk.Viewing.GuiViewer3D(container, config);
        this.forgeViewer.start();
        this.forgeViewer.setTheme('light-theme');
        this.forgeViewer.resize();
        resolve(this.forgeViewer);
      });
    });
  }

  async loadModel(viewer: any, urn: string): Promise<any> {
    viewer = this.forgeViewer;
    window.forgeViewer = this.forgeViewer;
    //urn="dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dmlld2VyLTNkLWJ1Y2tldC1hbmd1bGFyL3Rlc3RmaWxlMTIzNC5ud2Q=";
    return new Promise((resove, reject) => {
      const onDocumentLoadSuccess = (doc: any) => {
        resove(
          viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry())
        );
      };

      const onDocumentLoadFailure = (code: any, message: any, errors: any) => {
        reject({
          code,
          message,
          errors,
        });
      };

      viewer.setLightPreset(0);

      Autodesk.Viewing.Document.load(
        'urn:' + urn,

        onDocumentLoadSuccess,

        onDocumentLoadFailure
      );
    });
  }
}
