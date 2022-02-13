import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Image } from './helpers/image';
import { MovementPath } from './helpers/movement_path';
import { RightShape } from './helpers/right_shape';
import { Scene } from './helpers/scene';

@Component( {
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss'],
} )
export class CanvasComponent implements OnInit, AfterViewInit {
    @ViewChild( 'canvas' ) canvas!: ElementRef<HTMLCanvasElement>;
    context!: CanvasRenderingContext2D;
    image_helper!: Image;
    input_1: number = 0.1;
    input_2: number = 5;
    input_3: number = 100;
    input_4: number = 200;

    scene!: Scene;


    constructor () { }

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
        this.scene = new Scene(
            new RightShape( 6, 50, 0, { x: 50, y: 50 }, { r: 200, g: 0, b: 0, a: 255 } ),
            new MovementPath( { x: 256, y: 256 }, 150, 6, { r: 0, g: 200, b: 0, a: 255 } ),
            this.image_helper,
        );
    }

    click_fill () {
        /*
        this.image_helper.fill_gs( 0 );
        // this.image_helper.draw_line( this.input_1, this.input_2, this.input_3, this.input_4, { r: 0, g: 100, b: 0, a: 255 } );

        const sh = new RightShape( this.input_1, this.input_2, this.input_3, { x: this.input_4, y: this.input_4 } );
        sh.draw( this.image_helper );

        this.image_helper.apply();
        */
        this.scene.delta_rotation = this.input_1;
        this.scene.delta_location = this.input_2;
        this.scene.tick_interval = this.input_3;
    }
}
