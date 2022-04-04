import { Dot, Dot3d, PxColor } from './image';

export function pifagor_distance ( x1: number, y1: number, x2: number, y2: number ): number {
    return Math.sqrt( ( x1 - x2 ) * ( x1 - x2 ) + ( y1 - y2 ) * ( y1 - y2 ) );
}

export function pifagor_distance3d ( { x: x1, y: y1, z: z1 }: Dot3d, { x: x2, y: y2, z: z2 }: Dot3d ): number {
    return Math.sqrt( ( x1 - x2 ) * ( x1 - x2 ) + ( y1 - y2 ) * ( y1 - y2 ) + ( z1 - z2 ) * ( z1 - z2 ) );
}

export function line_intersect ( { x: x1, y: y1 }: Dot, { x: x2, y: y2 }: Dot, { x: x3, y: y3 }: Dot, { x: x4, y: y4 }: Dot ): Dot {
    let denom = ( y4 - y3 )*( x2 - x1 ) - ( x4 - x3 )*( y2 - y1 );
    if ( denom == 0 ) {
        denom = 0.00000001;
    }
    const ua = ( ( x4 - x3 )*( y1 - y3 ) - ( y4 - y3 )*( x1 - x3 ) )/denom;
    return {
        x: x1 + ua * ( x2 - x1 ),
        y: y1 + ua * ( y2 - y1 ),
    };
}

export function value_inbetween ( val: number, b1: number, b2: number ) {
    if ( b1 > b2 ) {
        const b3 = b1;
        b1 = b2;
        b2 = b3;
    }
    return b1 <= val && val <= b2;
}

export function ray_segment_intersect ( s1: Dot, s2: Dot, ray_origin: Dot, ray_point: Dot ) {
    const intersection: Dot = line_intersect( s1, s2, ray_origin, ray_point );
    if ( !value_inbetween( intersection.x, s1.x, s2.x ) ) {
        return false;
    }
    if ( !value_inbetween( intersection.y, s1.y, s2.y ) ) {
        return false;
    }
    const ray_direction = {
        x: Math.sign( ray_point.x - ray_origin.x ),
        y: Math.sign( ray_point.y - ray_origin.y ),
    };
    if ( ray_direction.x ) {
        if ( ray_origin.x > intersection.x ) {
            return false;
        }
    } else {
        if ( ray_origin.x < intersection.x ) {
            return false;
        }
    }

    if ( ray_direction.y ) {
        if ( ray_origin.y > intersection.y ) {
            return false;
        }
    } else {
        if ( ray_origin.y < intersection.y ) {
            return false;
        }
    }
    return true;
}

export function color_neg ( { r, g, b, a }: PxColor ): PxColor {
    return { r: 255 - r, g: 255 - g, b: 255 - b, a: a };
}

export function matrix_mutliply ( a: Array<Array<number>>, b: Array<Array<number>> ) {
    if ( !Array.isArray( a ) || !Array.isArray( b ) || !a.length || !b.length ) {
        throw new Error( 'arguments should be in 2-dimensional array format' );
    }
    const x = a.length;
    const z = a[0].length;
    const y = b[0].length;
    if ( b.length !== z ) {
        // XxZ & ZxY => XxY
        throw new Error( 'number of columns in the first matrix should be the same as the number of rows in the second' );
    }
    // eslint-disable-next-line prefer-spread
    const productRow = Array.apply( null, new Array( y ) ).map( Number.prototype.valueOf, 0 );
    const product = new Array( x );
    for ( let p = 0; p < x; p++ ) {
        product[p] = productRow.slice();
    }
    for ( let i = 0; i < x; i++ ) {
        for ( let j = 0; j < y; j++ ) {
            for ( let k = 0; k < z; k++ ) {
                product[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return product;
}
