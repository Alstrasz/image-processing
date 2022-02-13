import { pifagor_distance } from './ev_functions';
import { Image, PxColor } from './image';

export interface Dot {
    x: number,
    y: number
}

export interface DotInfo {
    pos: Dot,
    len_from_prev: number,
    len_from_start: number,
}

export class MovementPath {
    dots: Array<DotInfo> = [];

    constructor (
        center_pos: Dot,
        radius: number,
        number_of_dots: number,
        public color: PxColor = { r: 0, g: 200, b: 0, a: 255 },
    ) {
        this.gen_dots( center_pos, radius, number_of_dots );
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
        console.log( this.dots );
    }

    gen_dots ( cneter: Dot, radius: number, number_of_dots: number ) {
        if ( number_of_dots < 3 ) {
            throw new Error( `Not enough dots: ${number_of_dots} must be more then 2` );
        }
        const dots: Array<Dot> = [];
        for ( let i = 0; i < number_of_dots; i++ ) {
            dots.push( {
                x: Math.round( cneter.x + Math.cos( i / number_of_dots * Math.PI * 2 ) * ( radius - Math.random() * radius * 0.4 ) ),
                y: Math.round( cneter.y + Math.sin( i / number_of_dots * Math.PI * 2 ) * ( radius - Math.random() * radius * 0.4 ) ),
            } );
        }
        this.set_dots( dots );
    }

    mod_by_path_length ( length: number ) {
        return length % ( this.dots[this.dots.length - 1].len_from_start ); ;
    }

    get_pos_on_path ( length: number ): Dot {
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

    draw ( image: Image ) {
        for ( let i = 0; i < this.dots.length; i ++ ) {
            try {
                image.draw_line( this.dots[i].pos.x, this.dots[i].pos.y, this.dots[( i + 1 ) % this.dots.length].pos.x, this.dots[( i + 1 ) % this.dots.length].pos.y, this.color );
            } catch {
                console.log( `Cannot draw line (${this.dots[i].pos.x}, ${this.dots[i].pos.y})(${this.dots[( i + 1 ) % this.dots.length].pos.x}, ${this.dots[( i + 1 ) % this.dots.length].pos.y})` );
            }
        }
    }
}
