import { MovementPath } from './movement_path';
import { Dot, Image } from './image';
import { Shape } from './abstract_shape';
import { ArbitraryShape } from './arbitrary_shape';
import { Point } from './dot';

export class Scene {
    shape_delta_rotation: number = 0;
    shape_delta_location: number = 0;
    shape_current_location: number = 0;
    shape_current_rotation: number = 0;
    path_delta_rotation: number = 0;
    path_current_rotation: number = 0;
    tick_interval: number = 16;
    private tick_timeout!: NodeJS.Timeout;

    selected_vertex: {
        id: number | null,
        obj: ArbitraryShape | null,
    } = { id: null, obj: null };

    constructor (
        public shape: Shape,
        public path: MovementPath,
        public point: Point,
        public image: Image,
    ) {
        this.set_tick_timeout();
    }

    draw ( ) {
        this.image.fill_gs( 50 );
        this.shape.draw( this.image );
        this.path.draw( this.image );
        this.point.draw( this.image );
    }

    tick () {
        this.shape_current_rotation += this.shape_delta_rotation;
        this.shape_current_location = this.path.mod_by_path_length( this.shape_current_location );
        console.log( this.shape_current_location );
        this.shape_current_location += this.shape_delta_location;

        this.path_current_rotation += this.path_delta_rotation;

        this.shape.set_rotation( this.shape_current_rotation );
        this.shape.set_pos( this.path.get_pos_on_path( this.shape_current_location ) );

        this.path.set_rotation( this.path_current_rotation );
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

    vertex_select ( pos: Dot ) {
        let s = this.path.get_vertex_id_by_pos( pos, 10 );
        if ( s != null ) {
            this.selected_vertex = {
                id: s,
                obj: this.path,
            };
            return;
        }
        if ( this.shape instanceof ArbitraryShape ) {
            s = this.shape.get_vertex_id_by_pos( pos, 15 );
            if ( s != null ) {
                this.selected_vertex = {
                    id: s,
                    obj: this.shape,
                };
                return;
            }
        }

        if ( this.point ) {
            s = this.point.get_vertex_id_by_pos( pos, 15 );
            if ( s != null ) {
                this.selected_vertex = {
                    id: s,
                    obj: this.point as unknown as ArbitraryShape,
                };
                return;
            }
        }
    }

    vertex_drag ( pos: Dot ) {
        if ( this.selected_vertex.id == null || this.selected_vertex.obj == null ) {
            return;
        }
        this.selected_vertex.obj.update_vertex( this.selected_vertex.id, this.selected_vertex.obj.get_vertex_from_pos( pos ) );
    }

    vertes_release ( pos: Dot ) {
        if ( this.selected_vertex.id == null || this.selected_vertex.obj == null ) {
            return;
        }
        this.selected_vertex.obj.update_vertex( this.selected_vertex.id, this.selected_vertex.obj.get_vertex_from_pos( pos ) );
        this.selected_vertex.obj = null;
        this.selected_vertex.id = null;
    }
}
