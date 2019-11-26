import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireAuthModule } from "angularfire2/auth";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { CoreModule } from "./modules/core/core.module";
import { LayoutModule } from "./modules/layout/layout.module";
import { ServiceWorkerModule } from "@angular/service-worker";

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    LayoutModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // needed for database features
    AngularFireAuthModule, // needed for auth features,
    BrowserAnimationsModule, // needed for animation
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
