import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { BezierComponent } from './bezier/bezier.component';
import { CanvasComponent } from './canvas/canvas.component';
import { Canvas3dComponent } from './canvas3d/canvas3d.component';

const routes: Routes = [
    { path: '', component: BaseComponent },
    { path: '2d', component: CanvasComponent },
    { path: 'bezier', component: BezierComponent },
    { path: '3d', component: Canvas3dComponent },
];

@NgModule( {
    imports: [RouterModule.forRoot( routes )],
    exports: [RouterModule],
} )
export class AppRoutingModule { }
