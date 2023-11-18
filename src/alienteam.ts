import Alien from "./alien.js";
import Bullet from "./bullet.js";
import Player from "./player.js";

export default class AlienTeam {


    alienAnimate: number = 0;
    alienBitmap: ImageBitmap[] = [];
    alienWidth: number = 1;
    alienHeight: number = 1;
    alienTeamCanvas: HTMLCanvasElement[] = [];
    alienMoveDownCounter: number = 0;//0;
    alienMoveDown: boolean = false;//false;
    aliens: Alien[] = [];
    alienColumns: number = 0;//8;
    alienRows: number = 0;//4;
    direction: number = 0;//2;
    alienX: number = 0;//0;
    alienY: number = 0;// 20;
    bullets: Bullet[] = [];
    readonly gapBetweenAliens = 16;


    aliensWin = false;

    constructor() {
        this.alienTeamCanvas[0] = document.createElement("canvas");
        this.alienTeamCanvas[1] = document.createElement("canvas");
    }
    public moveAlienTeamAlong(width: number, height: number, level: number) {
        const slowDownLevel = 0.7;
        if (this.alienBitmap) {

            let lowestOfTheAliens: Alien[] = [];

            let minX = 0;
            let minY = 0;
            let maxX = 0;
            let maxY = 0;

            let row = 0;
            let col = this.direction;

            if (this.alienMoveDown) {
                row = 1;
                col = 0;
            }
            if (!this.aliensWin) {
                this.alienAnimate = this.alienAnimate + (0.1 * level * slowDownLevel * col);
            }

            this.alienX = this.alienX + col * level * slowDownLevel;
            this.alienY = this.alienY + row;
            const shallIFire = Math.floor(Math.random() * 100) > 97 ? true : false;
            for (let i of this.aliens) {
                let [x, y] = i.update(width, height, col, row, level * slowDownLevel);
                minX = x < minX ? x : minX;
                minY = y < minY ? y : minY;
                maxX = x > maxX ? x : maxX;
                maxY = y > maxY ? y : maxY;
                let added = false;
                for (let low = 0; low < lowestOfTheAliens.length; low++) {
                    let l = lowestOfTheAliens[low];
                    if (shallIFire && l.x == i.x && i.y >= l.y) {
                        lowestOfTheAliens[low] = i
                        added = true;
                    }
                }
                if (!added) {
                    lowestOfTheAliens.push(i);
                }
            }
            if (shallIFire && lowestOfTheAliens.length > 0) {
                const which = Math.floor(Math.random() * (lowestOfTheAliens.length-1));
                const bullet = new Bullet(lowestOfTheAliens[which].x + 27, lowestOfTheAliens[which].y + 16, false);
                this.bullets.push(bullet);
            }
            if (maxY >= height - this.alienBitmap[0].height) {
                this.aliensWin = true;
            }

            if (!this.alienMoveDown) {
                if (maxX >= width - this.alienBitmap[0].width || minX < 0) {
                    this.alienMoveDownCounter = this.alienBitmap[0].height;
                    this.alienMoveDown = true;
                }
            } else if (this.alienMoveDownCounter == 0) {
                this.direction = this.direction * -1;
                this.alienMoveDown = false;
            }
            --this.alienMoveDownCounter;
        }
    }
    public createTeamOfAliens() {

        this.alienColumns = 14;
        this.alienRows = 6;
        this.direction = 2;
        this.alienX = 0;
        this.alienY = 40;
        this.alienMoveDownCounter = 0;
        this.alienMoveDown = false;

        for (let c = 0; c <= 1; c++) {
            let ctx = this.alienTeamCanvas[c].getContext("2d");
            if (this.alienBitmap && ctx) {

                this.alienTeamCanvas[c].width = this.alienColumns * (this.alienBitmap[c].width + this.gapBetweenAliens) - this.gapBetweenAliens;
                this.alienTeamCanvas[c].height = this.alienRows * (this.alienBitmap[c].height + this.gapBetweenAliens) - this.gapBetweenAliens;
                for (let x = this.alienX; x < this.alienTeamCanvas[c].width; x = x + (this.alienBitmap[0].width + this.gapBetweenAliens)) {
                    for (let y = this.alienY; y < this.alienTeamCanvas[c].height; y = y + (this.alienBitmap[0].height + this.gapBetweenAliens)) {
                        ctx.drawImage(this.alienBitmap[c], x - this.alienX, y - this.alienY);
                        if (c == 0) {
                            this.aliens.push(new Alien(x, y))
                        }
                    }
                }
            } else {
                throw new Error("Alien not loaded!!!!");
            }
        }
    }

    alienBulletProcess(player: Player, screenWidth: number, screenHeight: number) {
        for (let b = this.bullets.length - 1; b >= 0; b--) {
            const bullet = this.bullets[b];
            let removeBullet = bullet.update(screenHeight)

            const diffX = Math.abs(bullet.x - player.x - player.playerWidth / 2);
            const diffY = Math.abs(bullet.y - player.y);
            if (diffX <= player.playerWidth / 2 && diffY < player.playerHeight / 4) {
                player.playerHit();
                removeBullet = true
            }
            if (removeBullet) {
                this.bullets.splice(b, 1)
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        let frame = Math.round(Math.abs(this.alienAnimate)) % this.alienTeamCanvas.length;
        if (frame <= 1) {
            ctx.drawImage(this.alienTeamCanvas[frame], this.alienX, this.alienY);
        }
        ctx.fillStyle = "green";
        for (let b of this.bullets) {
            ctx.fillRect(b.x, b.y, 6, 10);
        }
    }
    removeAlien(alien: Alien) {
        for (let c = 0; c <= 1; c++) {
            let ctx = this.alienTeamCanvas[c].getContext("2d");
            if (ctx) {
                ctx.clearRect(alien.x - this.alienX, alien.y - this.alienY, this.alienWidth, this.alienHeight);
            }
        }
    }
}
