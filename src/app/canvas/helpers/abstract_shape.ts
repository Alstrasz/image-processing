import { Image, Dot } from './image';

export abstract class Shape {
    abstract draw ( image: Image ): void;

    abstract set_rotation( new_val: number ): void;
    abstract set_pos( new_val: Dot ): void;
}
