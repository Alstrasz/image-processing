import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cube } from '../helpers/cube';
import { Image } from '../helpers/image';
import { Scene3d } from '../helpers/scene_3d';

@Component( {
    selector: 'app-canvas3d',
    templateUrl: './canvas3d.component.html',
    styleUrls: ['./canvas3d.component.scss'],
} )
export class Canvas3dComponent implements OnInit {
    @ViewChild( 'canvas' ) canvas!: ElementRef<HTMLCanvasElement>;
    context!: CanvasRenderingContext2D;
    image_helper!: Image;
    scene!: Scene3d;

    rotations = {
        x: 0,
        y: 0,
        z: 0,
    };

    constructor () {
    }

    ngOnInit (): void {
    }

    ngAfterViewInit (): void {
        const context = this.canvas.nativeElement.getContext( '2d' );
        if ( context == null ) {
            throw new Error( 'Context is null' );
        } else {
            this.context = context;
        }
        this.image_helper = new Image( this.context.getImageData( 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height ), this.context );
        this.scene = new Scene3d( { x: 256, y: 256 }, 20, [new Cube( { x: 0, y: 0, z: 0 }, 5, { r: 255, g: 0, b: 0, a: 255 } )], this.image_helper );
    }

    apply () {
        this.scene.rotation = this.rotations;
    }
}
