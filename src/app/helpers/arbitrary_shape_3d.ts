import { pifagor_distance3d } from './ev_functions';
import { Dot, Dot3d, Image, PxColor } from './image';

export interface PolarDot3d {
    angle_x: number,
    angle_z: number,
    radius: number
}

export class ArbitraryShape3d {
    center: Dot3d;
    polar_verticies: Array<PolarDot3d>;

    constructor (
        public original_dots: Array<Dot3d>,
        public edges: Array<[number, number]>,
        public color: PxColor,
    ) {
        this.center = this.get_original_center();
        this.polar_verticies = original_dots.map( this.get_polar_coordinates.bind( this ) );
        console.log( original_dots );
        console.log( this.color );
        console.log( this.center );
        console.log( this.polar_verticies );
        console.log( this.polar_verticies.map( this.get_ev_coordinates.bind( this ) ) );
    }

    get_description () {
        return {
            verticies: this.original_dots,
            edges: this.edges,
        };
    }

    draw ( image: Image, project_dot: ( dot: Dot3d ) => Dot ) {
        const dot_vertices = this.polar_verticies.map( this.get_ev_coordinates.bind( this ) ).map( project_dot );
        console.log( dot_vertices, this.original_dots.map( project_dot ) );

        for ( const e of this.edges ) {
            try {
                image.draw_line( dot_vertices[e[0]], dot_vertices[e[1]], this.color );
            } catch ( err ) {
                console.log( `3d shape: Cannot draw line (${dot_vertices[e[0]]}, ${dot_vertices[e[1]]}) due to ${err}` );
            }
        }
    }

    rotate ( ox: number, oz: number ) {
        for ( const v of this.polar_verticies ) {
            v.angle_x += ox;
            v.angle_z += oz;
        }
    }

    get_original_center (): Dot3d {
        const center: Dot3d = { x: 0, y: 0, z: 0 };
        for ( const dot of this.original_dots ) {
            center.x += dot.x;
            center.y += dot.y;
            center.z += dot.z;
        }
        center.x /= this.original_dots.length;
        center.y /= this.original_dots.length;
        center.z /= this.original_dots.length;
        return center;
    }

    get_polar_coordinates ( dot: Dot3d ): PolarDot3d {
        const pfd = pifagor_distance3d( this.center, dot );
        return {
            radius: pfd,
            angle_x: Math.acos( ( dot.x - this.center.x ) / pfd ) * Math.sign( Math.asin( ( dot.y - this.center.y ) / pfd ) ),
            angle_z: Math.acos( ( dot.z - this.center.z ) / pfd ) * Math.sign( Math.asin( ( dot.y - this.center.y ) / pfd ) ),
        };
    }

    get_ev_coordinates ( dot: PolarDot3d ): Dot3d {
        return {
            x: Math.cos( dot.angle_x ) * dot.radius,
            y: Math.sin( dot.angle_x ) * dot.radius,
            z: Math.cos( dot.angle_z ) * dot.radius,
        };
    }
}
