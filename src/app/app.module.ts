import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { BezierComponent } from './bezier/bezier.component';
import { BaseComponent } from './base/base.component';
import { Canvas3dComponent } from './canvas3d/canvas3d.component';

@NgModule( {
    declarations: [
        AppComponent,
        CanvasComponent,
        BezierComponent,
        BaseComponent,
        Canvas3dComponent,
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
