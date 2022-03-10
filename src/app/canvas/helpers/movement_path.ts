import { ArbitraryShape } from './arbitrary_shape';
import { pifagor_distance } from './ev_functions';
import { PxColor, Dot } from './image';

export interface DotInfo {
    pos: Dot,
    len_from_prev: number,
    len_from_start: number,
}

export class MovementPath extends ArbitraryShape {
    dots: Array<DotInfo> = [];

    constructor (
        center_pos: Dot,
        radius: number,
        number_of_dots: number,
        color: PxColor = { r: 0, g: 200, b: 0, a: 255 },
    ) {
        super( number_of_dots, radius, 0, center_pos, color );
        this.set_dots( this.vertices_to_pos() );
    }

    set_dots ( dots: Array<Dot> ) {
        if ( dots.length < 3 ) {
            throw new Error( `Not enough dots: ${dots.length} must be more then 2` );
        }
        this.dots = [];
        let total_path = 0;
        for ( let i = 0; i < dots.length; i++ ) {
            const len_from_prev = pifagor_distance( dots[i].x, dots[i].y, dots[( i + 1 ) % dots.length].x, dots[( i + 1 ) % dots.length].y );
            total_path += len_from_prev;
            this.dots.push( { pos: dots[i], len_from_prev: len_from_prev, len_from_start: total_path } );
        }
    }

    mod_by_path_length ( length: number ) {
        return length % ( this.dots[this.dots.length - 1].len_from_start ); ;
    }

    get_pos_on_path ( length: number ): Dot {
        this.set_dots( this.vertices_to_pos() );
        length = this.mod_by_path_length( length );
        let current = 0;
        while ( this.dots[current].len_from_start <= length ) {
            current += 1;
        }
        const from = this.dots[current].pos;
        const to = this.dots[( current + 1 ) % this.dots.length].pos;
        const percent = ( length - ( this.dots[current].len_from_start - this.dots[current].len_from_prev ) ) / this.dots[current].len_from_prev;
        return { x: from.x + ( to.x - from.x ) * percent, y: from.y + ( to.y - from.y ) * percent };
    }
}
