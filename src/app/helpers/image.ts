import { color_neg, pifagor_distance } from './ev_functions';

export interface Dot {
    x: number,
    y: number
}

export interface Dot3d {
    x: number,
    y: number,
    z: number,
}

export interface PxColor {
    r: number,
    g: number,
    b: number,
    a: number
}

export class Image {
    data: Uint8ClampedArray;
    width: number;
    height: number;

    constructor (
        public image_data: ImageData,
        private context?: CanvasRenderingContext2D,
    ) {
        this.data = this.image_data.data;
        this.width = this.image_data.width;
        this.height = this.image_data.height;
    }

    get_pixel ( { x, y }: Dot ): PxColor {
        if ( x >= this.width || y >= this.height || x < 0 || y < 0 ) {
            throw new Error( `Image: Pixel out of bounds [x, y] [${x},${y}] not in ${this.width}x${this.height}` );
        }
        const pos = y * ( this.width * 4 ) + x * 4;
        return { r: this.data[pos], g: this.data[pos + 1], b: this.data[pos + 2], a: this.data[pos + 3] };
    }

    set_pixel ( { x, y }: Dot, { r, g, b, a }: PxColor ): void {
        if ( x > this.width || y > this.height || x < 0 || y < 0 ) {
            throw new Error( `Image: Pixel out of bounds [x, y] [${x},${y}] not in ${this.width}x${this.height}` );
        }
        const pos = y * ( this.width * 4 ) + x * 4;
        this.data[pos + 0] = r > 255 ? 255 : ( r < 0 ? 0 : r );
        this.data[pos + 1] = g > 255 ? 255 : ( g < 0 ? 0 : g );
        this.data[pos + 2] = b > 255 ? 255 : ( b < 0 ? 0 : b );
        this.data[pos + 3] = a > 255 ? 255 : ( a < 0 ? 0 : a );
    }

    get_pixel_gs ( { x, y }: Dot ): number {
        const { r, g, b, ..._rest } = this.get_pixel( { x, y } );
        return 0.299 * r + 0.587 * g + 0.114 * b;
    };

    set_pixel_gs ( { x, y }: Dot, gs: number ) {
        gs = gs > 255 ? 255 : ( gs < 0 ? 0 : gs );
        this.set_pixel( { x, y }, { r: gs, g: gs, b: gs, a: 255 } );
    };

    fill_gs ( gs: number ): void {
        for ( let i = 0; i < this.width; i++ ) {
            for ( let j = 0; j < this.height; j++ ) {
                this.set_pixel_gs( { x: i, y: j }, gs );
            }
        }
    }
    /*
    draw_line ( x1: number, y1: number, x2: number, y2: number, color: PxColor ) {
        if ( x1 > x2 ) {
            const xt = x2;
            const yt = y2;
            x2 = x1;
            y2 = y1;
            x1 = xt;
            y1 = yt;
        }
        const current = { x: 0, y: 0 };
        const target = { x: x2 - x1, y: y2 - y1 };
        let mirrored = false;
        if ( target.y < 0 ) {
            target.y = y1 - y2;
            mirrored = true;
        }
        this.set_pixel( x1, y1, color );
        while ( current.x != target.x || current.y != target.y ) {
            const dx = target.x - current.x;
            const dy = target.y - current.y;
            let d = 2 * dy - dx;
            const de = 2 * dy;
            const dne = 2 * ( dy - dx );
            if ( d <= 0 ) {
                current.x += 1;
                d += de;
            } else {
                current.x += 1;
                current.y += 1;
                d += dne;
            }
            this.set_pixel( x1 + current.x, mirrored ? y1 - current.y : y1 + current.y, color );
        }
    }
*/
    draw_line ( { x: x1, y: y1 }: Dot, { x: x2, y: y2 }: Dot, color: PxColor ) {
        const dx = Math.abs( x1 - x2 );
        const dy = Math.abs( y1 - y2 );
        if ( dy <= dx ) {
            if ( x1 > x2 ) {
                const xt = x2;
                const yt = y2;
                x2 = x1;
                y2 = y1;
                x1 = xt;
                y1 = yt;
            }
            let mirrored = false;
            if ( y2 - y1 < 0 ) {
                mirrored = true;
            }

            let x = x1;
            let y = y1;
            let d = dy - Math.floor( dx / 2 );
            this.set_pixel( { x, y }, color );
            while ( x < x2 ) {
                x += 1;
                // dx -= 1;
                if ( d < 0 ) {
                    d += dy;
                    // console.log( 1 );
                } else {
                    // console.log( 2 );
                    d += dy - dx;
                    y += 1;
                    // dy -= 1;
                }
                this.set_pixel( { x: x, y: mirrored ? 2 * y1 - y : y }, color );
            }
        } else if ( dx <= dy ) {
            if ( y1 > y2 ) {
                const xt = x2;
                const yt = y2;
                x2 = x1;
                y2 = y1;
                x1 = xt;
                y1 = yt;
            }
            let mirrored = false;
            if ( x2 - x1 < 0 ) {
                mirrored = true;
            }

            let d = dx - dy / 2;
            let x = x1;
            let y = y1;
            this.set_pixel( { x, y }, color );
            while ( y < y2 ) {
                y += 1;
                // dy -= 1;
                if ( d < 0 ) {
                    d += dx;
                    // console.log( 3 );
                } else {
                    d += dx - dy;
                    x += 1;
                    // console.log( 4 );
                    // dx -= 1;
                }
                this.set_pixel( { x: mirrored ? 2 * x1 - x : x, y: y }, color );
            }
            // console.log( x1, x2 );
        }
    }

    draw_quadratic_bezier_basic ( a: Dot, b: Dot, c: Dot, color: PxColor ) {
        const iter_num = pifagor_distance( a.x, a.y, b.x, b.y ) + pifagor_distance( c.x, c.y, b.x, b.y );
        for ( let i = 0; i <= iter_num; i++ ) {
            const t = i / iter_num;
            const nt = 1 - t;
            const x = Math.round( nt * nt * a.x + 2 * nt * t * b.x + t * t * c.x );
            const y = Math.round( nt * nt * a.y + 2 * nt * t * b.y + t * t * c.y );
            this.set_pixel( { x, y }, color );
        }
    }

    draw_quadratic_bezier ( dots: Array<Dot>, color: PxColor ) {
        if ( ! ( dots.length >= 3 && ( dots.length - 3 ) % 2 == 0 ) ) {
            console.error( `Dots length missmatch, expected 3 + 2k, got ${dots.length}` );
        }
        for ( let i = 0; i < dots.length - 1; i += 2 ) {
            this.draw_quadratic_bezier_basic( dots[i], dots[i + 1], dots[i + 2], color );
        }
    }

    draw_quadratic_bezier_helper ( dots: Array<Dot>, color: PxColor ) {
        this.draw_quadratic_bezier( dots, color );
        for ( let i = 0; i < dots.length - 1; i++ ) {
            this.draw_line( dots[i], dots[i + 1], color_neg( color ) );
        }
    }

    apply ( dx: number = 0, dy: number = 0, context?: CanvasRenderingContext2D ) {
        if ( context ) {
            context.putImageData( this.image_data, dx, dy );
        } else if ( this.context ) {
            this.context.putImageData( this.image_data, dx, dy );
        } else {
            throw new Error( 'Context not specified' );
        }
    }
}
