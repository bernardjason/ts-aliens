import Bullet from "./bullet.js";
import AlienTeam from "./alienteam.js";

class xy {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export default class Defence {

    bricks: xy[] = [];
    readonly border: number = 100;
    readonly brickWidthHeight = 10;
    readonly bricksInBlock = 5;

    constructor(screenWidth: number, screenHeight: number) {

        for (let xx = this.border; xx < screenWidth - this.border; xx = xx + this.border * 1.5) {
            for (let y = screenHeight - this.border - this.bricksInBlock * this.brickWidthHeight;
                y < screenHeight - this.border; y = y + this.brickWidthHeight) {
                for (let x = xx; x < xx + this.bricksInBlock * this.brickWidthHeight; x = x + this.brickWidthHeight) {
                    this.bricks.push(new xy(x, y))
                }
            }

        }

    }

    handleBullets(playerBullets: Bullet[], alienBullets: Bullet[] , alienTeam:AlienTeam) {
        this.processBullets(playerBullets);
        this.processBullets(alienBullets);

        for(let i of alienTeam.aliens) {
            for (let t = this.bricks.length-1; t >= 0; t--) {
                const brick = this.bricks[t];

                const diffX = Math.abs(brick.x - i.x );
                const diffY = Math.abs(brick.y - i.y );
                if (diffX < this.brickWidthHeight *2 && diffY < alienTeam.alienHeight) {
                    this.bricks.splice(t, 1);

                }
            }
        }
    }

    private processBullets(bullets: Bullet[]) {
        for (let b = bullets.length - 1; b >= 0; b--) {
            const bullet = bullets[b];
            for (let t = this.bricks.length-1; t >= 0; t--) {
                const brick = this.bricks[t];

                const diffX = Math.abs(bullet.x - brick.x - this.brickWidthHeight / 2);
                const diffY = Math.abs(bullet.y - brick.y - this.brickWidthHeight / 2);
                if (diffX <= this.brickWidthHeight && diffY < this.brickWidthHeight) {
                    this.bricks.splice(t, 1);
                    bullets.splice(b, 1);
                    break;
                }
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "yellow";
        ctx.strokeStyle = "yellow";
        for (let b of this.bricks) {
            ctx.strokeRect(b.x, b.y, this.brickWidthHeight, this.brickWidthHeight)
        }
    }
}