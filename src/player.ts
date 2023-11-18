import Bullet from "./bullet.js";
import AlienTeam from "./alienteam.js";

export default class Player {
    x:number;
    y:number;
    lives:number=5;
    score:number=0;
    level:number=0;
    directionX:number;
    speed:number = 4;
    bullets:Bullet[] = [];
    hitSound:HTMLAudioElement
    playerWidth:number=0;
    playerHeight:number=0;
    sinceLastFire:number=-999;

    constructor(x:number,y:number,hitSound:HTMLAudioElement) {
        this.x=x;
        this.y=y;
        this.directionX=0;
        this.hitSound = hitSound;

    }
    update(width:number,height:number) {
        this.x = this.x  + this.directionX * this.speed;
        if(this.x < 0 || this.x > width - this.playerWidth ) {
            this.x = this.x  - this.directionX * this.speed;
            this.directionX = 0;
        }
        for(let i = this.bullets.length-1 ; i >=  0 ; i--) {
            if ( this.bullets[i].update(height) ) {
                this.bullets.splice(i,1);
            }
        }
    }
    fire(clicks:number):boolean {
        if ( clicks - this.sinceLastFire >20 ) {
            const bullet = new Bullet(this.x + 28,this.y ,true);
            this.bullets.push(bullet);
            this.sinceLastFire = clicks;
            return true;
        }
        return false;

    }
    playerHit() {
        this.lives--;
        this.hitSound.play();
    }

     playerHitAlien(alienTeam:AlienTeam) {
        for (let b = this.bullets.length - 1; b >= 0; b--) {
            for (let i = alienTeam.aliens.length - 1; i >= 0; i--) {
                const bullet = this.bullets[b];
                const alien = alienTeam.aliens[i];
                const diffX = Math.abs(bullet.x - alien.x - alienTeam.alienWidth / 2);
                const diffY = Math.abs(bullet.y - alien.y);
                if (diffX < alienTeam.alienWidth / 2 + 1 && diffY < alienTeam.alienHeight) {
                    this.score++;
                    this.bullets.splice(b, 1);
                    alienTeam.removeAlien(alien);
                    alienTeam.aliens.splice(i, 1);
                    break;
                }
            }
        }
    }
}