export default class Alien {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    update(width: number, height: number, directionX: number, directionY: number,levelSpeed:number): [number, number] {
        this.x = this.x + directionX * levelSpeed;
        this.y = this.y + directionY ;
        return [this.x, this.y];
    }
}

