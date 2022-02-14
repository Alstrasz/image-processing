import { Shape } from './abstract_shape';
import { Image, PxColor, Dot } from './image';

export interface VertexInfo {
    rotation: number,
    radius: number,
}

export class ArbitraryShape implements Shape {
    private vertices: Array<VertexInfo> = [];

    constructor (
        public number_of_vertices: number,
        public default_radius: number,
        public rotation: number = 0,
        public pos = { x: 0, y: 0 },
        public color: PxColor = { r: 0, g: 0, b: 200, a: 255 },
    ) {
        this.vertices = this.gen_vertices();
    }

    gen_vertices (): Array<VertexInfo> {
        const vertices: Array<VertexInfo> = [];
        for ( let i = 0; i < this.number_of_vertices; i++ ) {
            vertices.push( {
                rotation: Math.PI * 2 / this.number_of_vertices * i + ( Math.random() - 0.5 ) * ( Math.PI * 2 / this.number_of_vertices ),
                radius: this.default_radius + ( Math.random() - 0.5 ) * this.default_radius,
            } );
        }
        return vertices;
    }

    set_rotation ( new_val: number ) {
        this.rotation = new_val;
    }

    set_pos ( new_val: { x: number, y: number } ) {
        this.pos = new_val;
    }

    vertices_to_pos ( ): Array<Dot> {
        const ret: Array<Dot> = [];

        for ( const vertex of this.vertices ) {
            ret.push( {
                x: Math.round( this.pos.x + Math.cos( vertex.rotation + this.rotation ) * vertex.radius ),
                y: Math.round( this.pos.y + Math.sin( vertex.rotation + this.rotation ) * vertex.radius ),
            } );
        }
        console.log( ret, this.vertices );
        return ret;
    }

    draw ( image: Image ) {
        const dot_vertices = this.vertices_to_pos();

        for ( let i = 0; i < dot_vertices.length; i ++ ) {
            try {
                image.draw_line( { x: dot_vertices[i].x, y: dot_vertices[i].y },
                    { x: dot_vertices[( i + 1 ) % dot_vertices.length].x, y: dot_vertices[( i + 1 ) % dot_vertices.length].y },
                    this.color );
            } catch ( e ) {
                console.log( `Right shape: Cannot draw line (${
                    dot_vertices[i].x}, ${dot_vertices[i].y})(${dot_vertices[( i + 1 ) % dot_vertices.length].x
                }, ${dot_vertices[( i + 1 ) % dot_vertices.length].y
                }) due to ${e}` );
            }
        }
    }
}
