import { ArbitraryShape3d } from './arbitrary_shape_3d';
import { Dot3d, PxColor } from './image';

export class Cube extends ArbitraryShape3d {
    constructor ( center: Dot3d, edge_length: number, color: PxColor ) {
        super(
            [
                { x: center.x + edge_length / 2, y: center.y + edge_length / 2, z: center.z + edge_length / 2 },
                { x: center.x - edge_length / 2, y: center.y + edge_length / 2, z: center.z + edge_length / 2 },
                { x: center.x + edge_length / 2, y: center.y - edge_length / 2, z: center.z + edge_length / 2 },
                { x: center.x - edge_length / 2, y: center.y - edge_length / 2, z: center.z + edge_length / 2 },
                { x: center.x + edge_length / 2, y: center.y + edge_length / 2, z: center.z - edge_length / 2 },
                { x: center.x - edge_length / 2, y: center.y + edge_length / 2, z: center.z - edge_length / 2 },
                { x: center.x + edge_length / 2, y: center.y - edge_length / 2, z: center.z - edge_length / 2 },
                { x: center.x - edge_length / 2, y: center.y - edge_length / 2, z: center.z - edge_length / 2 },
            ],
            [[0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7]],
            color,
        );
    }
}
