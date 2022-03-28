import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArbitraryShape } from '../helpers/arbitrary_shape';
import { Point } from '../helpers/dot';
import { Image } from '../helpers/image';
import { MovementPath } from '../helpers/movement_path';
import { Scene } from '../helpers/scene';

@Component( {
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss'],
} )
export class CanvasComponent implements OnInit, AfterViewInit {
    @ViewChild( 'canvas' ) canvas!: ElementRef<HTMLCanvasElement>;
    context!: CanvasRenderingContext2D;
    image_helper!: Image;
    input_1: number = 0.01;
    input_2: number = 2;
    input_3: number = 16;
    input_4: number = 0.01;
    is_dot_inside: boolean = false;

    scene!: Scene;


    constructor ( private activated_route: ActivatedRoute ) { }

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
        let resolve: ( value: unknown ) => void;
        const prom = new Promise<any>( ( res ) => {
            resolve = res;
        } );
        let par: any = {};
        this.activated_route.queryParams.subscribe( ( params ) => {
            console.log( 'in sub', params );
            par = params;
        } );
        setTimeout( () => {
            resolve( {} );
        }, 400 );
        prom.then( ( ) => {
            console.log( 'in prm', par );
            this.scene = this.scene = new Scene(
                new ArbitraryShape( par.vs || 6, 50, 0, { x: 50, y: 50 }, { r: 200, g: 0, b: 0, a: 255 } ),
                new MovementPath( { x: 256, y: 256 }, 150, par.ps || 6, { r: 0, g: 200, b: 0, a: 255 } ),
                new Point( { x: 256, y: 256 } ),
                this.image_helper,
                ( new_val: boolean ) => {
                    this.is_dot_inside = new_val;
                },
            );
        } );
    }

    click_fill () {
        /*
        this.image_helper.fill_gs( 0 );
        // this.image_helper.draw_line( this.input_1, this.input_2, this.input_3, this.input_4, { r: 0, g: 100, b: 0, a: 255 } );

        const sh = new RightShape( this.input_1, this.input_2, this.input_3, { x: this.input_4, y: this.input_4 } );
        sh.draw( this.image_helper );

        this.image_helper.apply();
        */
        this.scene.shape_delta_rotation = this.input_1;
        this.scene.shape_delta_location = this.input_2;
        this.scene.tick_interval = this.input_3;
        this.scene.path_delta_rotation = this.input_4;
    }

    canvas_mouse_down ( event: MouseEvent ) {
        const pos = {
            x: event.x - ( ( event.target as HTMLCanvasElement )?.offsetLeft || 0 ),
            y: event.y - ( ( event.target as HTMLCanvasElement )?.offsetTop || 0 ),
        };
        if ( this.scene ) {
            this.scene.vertex_select( pos );
        }
    }

    canvas_mouse_move ( event: MouseEvent ) {
        const pos = {
            x: event.x - ( ( event.target as HTMLCanvasElement )?.offsetLeft || 0 ),
            y: event.y - ( ( event.target as HTMLCanvasElement )?.offsetTop || 0 ),
        };
        if ( this.scene ) {
            this.scene.vertex_drag( pos );
        }
    }

    canvas_mouse_up ( event: MouseEvent ) {
        const pos = {
            x: event.x - ( ( event.target as HTMLCanvasElement )?.offsetLeft || 0 ),
            y: event.y - ( ( event.target as HTMLCanvasElement )?.offsetTop || 0 ),
        };
        if ( this.scene ) {
            this.scene.vertes_release( pos );
        }
    }
}
