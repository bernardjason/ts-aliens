export default class Bullet {
    x:number;
    y:number;
    player:boolean;
    yDirection:number;
    speed:number = 6;
    constructor(x:number,y:number,player:boolean) {
        this.x=x;
        this.y=y;
        this.player=player;
        if( player ) {
            this.yDirection = -1;
        } else {
            this.yDirection = 1;
            this.speed = 4;
        }
    }
    update(height:number):boolean {
        this.y=this.y + this.yDirection * this.speed;
        if (this.y < 0 || this.y > height  ) {
            return true;
        }
        return false;
    }



}