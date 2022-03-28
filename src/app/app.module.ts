import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { BezierComponent } from './bezier/bezier.component';

@NgModule( {
    declarations: [
        AppComponent,
        CanvasComponent,
        BezierComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
} )
export class AppModule { }
