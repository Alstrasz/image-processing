import { Dot, Dot3d, Image, PxColor } from './image';
import * as math from 'mathjs';
import { matrix_mutliply } from './ev_functions';

export interface PolarDot3d {
    angle_x: number,
    angle_z: number,
    radius: number
}

export class ArbitraryShape3d {
    center: Dot3d;

    constructor (
        public dots: Array<Dot3d>,
        public edges: Array<[number, number]>,
        public color: PxColor,
    ) {
        this.center = this.get_original_center();
    }

    draw ( image: Image, project_dot: ( dot: Dot3d ) => Dot ) {
        const dot_vertices = this.dots.map( project_dot );
        // console.log( this.polar_verticies.map( this.get_ev_coordinates.bind( this ) ), dot_vertices, this.original_dots, this.original_dots.map( project_dot ) );

        for ( const e of this.edges ) {
            try {
                image.draw_line( dot_vertices[e[0]], dot_vertices[e[1]], this.color );
            } catch ( err ) {
                console.log( `3d shape: Cannot draw line (${dot_vertices[e[0]]}, ${dot_vertices[e[1]]}) due to ${err}` );
            }
        }
    }

    rotate ( ox: number, oy: number, oz: number ) {
        const mx = [
            [1, 0, 0],
            [0, math.cos( ox ), -math.sin( ox )],
            [0, math.sin( ox ), math.cos( ox )],
        ];
        const my = [
            [math.cos( oy ), 0, math.sin( oy )],
            [0, 1, 0],
            [-math.sin( oy ), 0, math.cos( oy )],
        ];
        const mz = [
            [math.cos( oz ), -math.sin( oz ), 0],
            [math.sin( oz ), math.cos( oz ), 0],
            [0, 0, 1],
        ];
        const rotate = matrix_mutliply( matrix_mutliply( mz, my ), mx );
        for ( const v of this.dots ) {
            const nv = matrix_mutliply( rotate, [[v.x], [v.y], [v.z]] );
            // console.log( mx, nv );
            v.x = nv[0][0];
            v.y = nv[1][0];
            v.z = nv[2][0];
        }
    }

    get_original_center (): Dot3d {
        const center: Dot3d = { x: 0, y: 0, z: 0 };
        for ( const dot of this.dots ) {
            center.x += dot.x;
            center.y += dot.y;
            center.z += dot.z;
        }
        center.x /= this.dots.length;
        center.y /= this.dots.length;
        center.z /= this.dots.length;
        return center;
    }
}
