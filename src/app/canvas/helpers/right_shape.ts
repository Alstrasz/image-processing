import { Image, PxColor } from './image';


export class RightShape {
    number_of_vertices: number = 3;
    radius = 5;

    constructor (
        number_of_vertices: number,
        radius: number,
        public rotation: number = 0,
        public pos = { x: 0, y: 0 },
        public color: PxColor = { r: 200, g: 0, b: 0, a: 255 },
    ) {
        this.set_number_of_vertices( number_of_vertices );
        this.set_radius( radius );
    }

    set_number_of_vertices ( new_val: number ) {
        if ( new_val < 3 ) {
            throw new Error( `Number of verices is too small ${new_val}` );
        }
        this.number_of_vertices = new_val;
    }

    set_radius ( new_val: number ) {
        if ( new_val < 1 ) {
            throw new Error( `Number of verices is too small ${new_val}` );
        }
        this.radius = new_val;
    }

    set_rotation ( new_val: number ) {
        this.rotation = new_val;
    }

    set_pos ( new_val: { x: number, y: number } ) {
        this.pos = new_val;
    }

    get_vertices () {
        const vertices = [];
        for ( let i = 0; i < this.number_of_vertices; i++ ) {
            vertices.push( {
                x: Math.round( this.pos.x + Math.cos( i / this.number_of_vertices * Math.PI * 2 + this.rotation ) * this.radius ),
                y: Math.round( this.pos.y + Math.sin( i / this.number_of_vertices * Math.PI * 2 + this.rotation ) * this.radius ),
            } );
        }
        return vertices;
    }

    draw ( image: Image ) {
        const vertices = this.get_vertices();
        for ( let i = 0; i < vertices.length; i ++ ) {
            try {
                image.draw_line( vertices[i].x, vertices[i].y, vertices[( i + 1 ) % vertices.length].x, vertices[( i + 1 ) % vertices.length].y, this.color );
            } catch {
                console.log( `Cannot draw line (${vertices[i].x}, ${vertices[i].y})(${vertices[( i + 1 ) % vertices.length].x}, ${vertices[( i + 1 ) % vertices.length].y})` );
            }
        }
    }
}
