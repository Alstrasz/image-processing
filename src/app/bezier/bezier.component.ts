import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { pifagor_distance } from '../helpers/ev_functions';
import { Dot, Image } from '../helpers/image';

@Component( {
    selector: 'app-bezier',
    templateUrl: './bezier.component.html',
    styleUrls: ['./bezier.component.scss'],
} )
export class BezierComponent implements OnInit, AfterViewInit {
    @ViewChild( 'canvas' ) canvas!: ElementRef<HTMLCanvasElement>;
    context!: CanvasRenderingContext2D;
    image_helper!: Image;
    curves: Array<Array<Dot>>;
    selected_point: [number, number] = [-1, 0];
    selected_curve: number = 0;
    current_pos: [number, number] = [0, 0];
    curves_stringed: string = '';
    with_helpers: boolean = true;


    constructor () {
        this.curves = [
            [{ x: 11, y: 162 }, { x: 11, y: 204 }, { x: 13, y: 258 }, { x: 43, y: 274 }, { x: 58, y: 260 }],
            [{ x: 73, y: 225 }, { x: 75, y: 280 }, { x: 95, y: 286 }, { x: 116, y: 288 }, { x: 122, y: 228 }, { x: 123, y: 273 }, { x: 122, y: 289 }],
            [{ x: 155, y: 139 }, { x: 149, y: 206 }, { x: 145, y: 229 }, { x: 167, y: 217 },
                { x: 131, y: 217 }, { x: 135, y: 219 }, { x: 146, y: 232 }, { x: 142, y: 296 }, { x: 153, y: 299 }, { x: 167, y: 301 }, { x: 172, y: 270 }],
            [{ x: 222, y: 238 }, { x: 198, y: 233 }, { x: 195, y: 265 }, { x: 229, y: 288 }, { x: 183, y: 308 }],
            [{ x: 285, y: 269 }, { x: 231, y: 216 }, { x: 246, y: 307 }, { x: 293, y: 307 }, { x: 282, y: 252 }, { x: 292, y: 324 }, { x: 300, y: 301 }],
            [{ x: 301, y: 244 }, { x: 314, y: 310 }, { x: 330, y: 315 }, { x: 345, y: 316 }, { x: 341, y: 246 }, { x: 358, y: 354 }, { x: 319, y: 395 }, { x: 323, y: 334 }, { x: 362, y: 295 }],
        ];
        this.curves_to_string();
    }

    curves_to_string () {
        this.curves_stringed = JSON.stringify( this.curves )
            .split( '[[' ).join( '[\n\t[' )
            .split( '],[' ).join( '],\n\t[' )
            .split( ']]' ).join( ']\n]' )
            .split( '"x":' ).join( 'x:' )
            .split( '"y":' ).join( 'y:' );
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
        setInterval( () => {
            this.draw();
        }, 16 );
    }

    draw () {
        this.curves_to_string();
        this.image_helper.fill_gs( 0 );
        for ( const curve of this.curves ) {
            if ( this.with_helpers ) {
                this.image_helper.draw_quadratic_bezier_helper( curve, { r: 255, g: 0, b: 0, a: 255 } );
            } else {
                this.image_helper.draw_quadratic_bezier( curve, { r: 255, g: 0, b: 0, a: 255 } );
            }
        }
        this.image_helper.apply();
    }


    add_points ( ) {
        this.curves[this.selected_curve].push( { x: 10, y: 100 } );
        this.curves[this.selected_curve].push( { x: 100, y: 100 } );
    }

    remove_points ( ) {
        this.curves[this.selected_curve].pop();
        this.curves[this.selected_curve].pop();
        if ( this.curves[this.selected_curve].length < 3 ) {
            this.curves.splice( this.selected_curve, 1 );
        }
    }

    add_curve () {
        this.curves.push( [{ x: 10, y: 10 }, { x: 100, y: 10 }, { x: 100, y: 100 }] );
    }

    canvas_mouse_down ( event: MouseEvent ) {
        const pos = {
            x: event.x - ( ( event.target as HTMLCanvasElement )?.offsetLeft || 0 ),
            y: event.y - ( ( event.target as HTMLCanvasElement )?.offsetTop || 0 ),
        };

        for ( let i = 0; i < this.curves.length; i ++ ) {
            for ( let j = 0; j < this.curves[i].length; j ++ ) {
                if ( pifagor_distance( pos.x, pos.y, this.curves[i][j].x, this.curves[i][j].y ) < 10 ) {
                    this.selected_point = [i, j];
                    return;
                }
            }
        }
        this.selected_point = [-1, -1];
    }

    canvas_mouse_move ( event: MouseEvent ) {
        const pos = {
            x: event.x - ( ( event.target as HTMLCanvasElement )?.offsetLeft || 0 ),
            y: event.y - ( ( event.target as HTMLCanvasElement )?.offsetTop || 0 ),
        };
        this.current_pos = [pos.x, pos.y];
        if ( this.selected_point[0] >= 0 && this.selected_point[1] >= 0 ) {
            this.curves[this.selected_point[0]][this.selected_point[1]] = pos;
        }
    }

    canvas_mouse_up ( _event: MouseEvent ) {
        this.selected_point = [-1, -1];
    }
}
