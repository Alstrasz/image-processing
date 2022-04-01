import { ArbitraryShape3d } from './arbitrary_shape_3d';
import { Dot, Dot3d, Image } from './image';

export class Scene3d {
    private tick_timeout!: NodeJS.Timeout;
    tick_interval: number = 16;

    constructor (
        public center: Dot,
        public scale: number,
        public shapes: Array<ArbitraryShape3d>,
        public image: Image,
    ) {
        this.set_tick_timeout();
    }

    project_dot ( dot: Dot3d ): Dot {
        return { x: Math.round( dot.x * this.scale + this.center.x ), y: Math.round( dot.y * this.scale + this.center.y ) };
    }

    draw ( ) {
        this.image.fill_gs( 50 );
        this.draw_axis();
        for ( const shape of this.shapes ) {
            shape.draw( this.image, this.project_dot.bind( this ) );
        }
    }

    draw_axis () {
        const dots_2d = [{ x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 0 }, { x: 0, y: 10, z: 0 }, { x: 0, y: 0, z: 10 }].map( this.project_dot.bind( this ) );
        try {
            this.image.draw_line( dots_2d[0], dots_2d[1], { r: 0, g: 255, b: 0, a: 255 } );
        } catch ( err ) {
            console.log( `Scene 3d axis: Cannot draw line (${dots_2d[0]}, ${dots_2d[1]}) due to ${err}` );
        }
        try {
            this.image.draw_line( dots_2d[0], dots_2d[2], { r: 0, g: 255, b: 0, a: 255 } );
        } catch ( err ) {
            console.log( `Scene 3d axis: Cannot draw line (${dots_2d[0]}, ${dots_2d[2]}) due to ${err}` );
        }
        try {
            this.image.draw_line( dots_2d[0], dots_2d[3], { r: 0, g: 255, b: 0, a: 255 } );
        } catch ( err ) {
            console.log( `Scene 3d axis: Cannot draw line (${dots_2d[0]}, ${dots_2d[3]}) due to ${err}` );
        }
    }

    tick () {
        for ( const shape of this.shapes ) {
            shape.rotate( 0.01, 0.01 );
        }
    }

    set_tick_timeout () {
        clearTimeout( this.tick_timeout );
        this.tick_timeout = setTimeout( () => {
            try {
                this.tick();
            } catch ( e ) {
                console.log( `Scene cannot tick due to ${e}` );
            }
            try {
                this.draw();
                this.image.apply();
            } catch ( e ) {
                console.log( `Scene cannot draw due to ${e}` );
            }
            this.set_tick_timeout();
        }, this.tick_interval );
    }
}
