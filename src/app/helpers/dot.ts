import { Shape } from './abstract_shape';
import { pifagor_distance } from './ev_functions';
import { Image, Dot, PxColor } from './image';


export class Point implements Shape {
    constructor (
        public pos: Dot,
        public color: PxColor = { r: 0, g: 0, b: 255, a: 255 },
    ) {};

    draw ( image: Image ): void {
        try {
            image.set_pixel( this.pos, this.color );
        } catch ( e ) {
            console.log( `Draw point at ${JSON.stringify( this.pos )} error: ${e}` );
        }
        try {
            image.set_pixel( { x: this.pos.x - 1, y: this.pos.y - 1 }, this.color );
        } catch ( e ) {
            console.log( `Draw point at ${JSON.stringify( this.pos )} error: ${e}` );
        }
        try {
            image.set_pixel( { x: this.pos.x - 1, y: this.pos.y + 1 }, this.color );
        } catch ( e ) {
            console.log( `Draw point at ${JSON.stringify( this.pos )} error: ${e}` );
        }
        try {
            image.set_pixel( { x: this.pos.x + 1, y: this.pos.y - 1 }, this.color );
        } catch ( e ) {
            console.log( `Draw point at ${JSON.stringify( this.pos )} error: ${e}` );
        }
        try {
            image.set_pixel( { x: this.pos.x + 1, y: this.pos.y + 1 }, this.color );
        } catch ( e ) {
            console.log( `Draw point at ${JSON.stringify( this.pos )} error: ${e}` );
        }
    };

    set_rotation ( _new_val: number ): void {};

    set_pos ( new_val: Dot ): void {
        this.pos = new_val;
    };

    get_vertex_id_by_pos ( pos: Dot, radius_threshold: number ) {
        if ( pifagor_distance( pos.x, pos.y, this.pos.x, this.pos.y ) <= radius_threshold ) {
            return 0;
        }
        return null;
    }

    get_vertex_from_pos ( pos: Dot ) {
        return pos;
    }

    update_vertex ( _id: any, new_val: Dot ): void {
        this.set_pos( new_val );
    }
}
