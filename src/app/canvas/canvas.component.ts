import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Image } from './helpers/image';

@Component( {
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss'],
} )
export class CanvasComponent implements OnInit, AfterViewInit {
    @ViewChild( 'canvas' ) canvas!: ElementRef<HTMLCanvasElement>;
    context!: CanvasRenderingContext2D;
    image_helper!: Image;
    input_1: number = 199;
    input_2: number = 200;
    input_3: number = 50;
    input_4: number = 40;

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
    }

    click_fill () {
        // this.image_helper.fill_gs( 127 );
        this.image_helper.draw_line( this.input_1, this.input_2, this.input_3, this.input_4, { r: 0, g: 100, b: 0, a: 255 } );
        this.image_helper.apply();
    }
}
