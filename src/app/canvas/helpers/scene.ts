import { MovementPath } from './movement_path';
import { RightShape } from './right_shape';
import { Image } from './image';

export class Scene {
    delta_rotation: number = 0;
    delta_location: number = 0;
    current_location = 0;
    current_rotation = 0;
    tick_interval: number = 100;
    private tick_timeout!: NodeJS.Timeout;

    constructor (
        public shape: RightShape,
        public path: MovementPath,
        public image: Image,
    ) {
        this.set_tick_timeout();
    }

    draw ( ) {
        this.image.fill_gs( 0 );
        this.shape.draw( this.image );
        this.path.draw( this.image );
    }

    tick () {
        this.current_rotation += this.delta_rotation;
        this.current_location += this.delta_location;

        this.shape.set_rotation( this.current_rotation );
        this.shape.set_pos( this.path.get_pos_on_path( this.current_location ) );
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
