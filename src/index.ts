import Alien from "./alien.js"
import Bullet from "./bullet.js";
import Player from "./player.js"
import AlienTeam from "./alienteam.js";
import Defence from "./defence.js";
class Game {

    alienTeam: AlienTeam;
    playerBitmap: ImageBitmap ;
    defences: Defence;
    player: Player;
    screenWidth: number;
    screenHeight: number;
    fireSound: HTMLAudioElement = new Audio();
    hitSound: HTMLAudioElement = new Audio();
    clicks:number=0;

    constructor(playerBitmap: ImageBitmap, alienBitmaps: ImageBitmap[]) {
        const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement,
            ctx = canvas.getContext("2d")

        this.screenWidth = canvas.width;
        this.screenHeight = canvas.height;
        this.fireSound = document.getElementById("fire") as HTMLAudioElement;
        this.hitSound = document.getElementById("hit") as HTMLAudioElement;
        this.fireSound.autoplay = true;
        this.hitSound.autoplay = true;


        this.alienTeam = new AlienTeam();
        this.player = new Player(canvas.width / 2, canvas.height - 1, this.hitSound);
        this.defences = new Defence(this.screenWidth,this.screenHeight);

        this.playerBitmap = playerBitmap
        this.player.playerHeight = playerBitmap.height;
        this.player.playerWidth = playerBitmap.width;
        this.player.y = canvas.height - this.player.playerHeight;
        this.player.x = canvas.width / 2 - this.player.playerWidth / 2;

        for (let c = 0; c < alienBitmaps.length; c++) {
            this.alienTeam.alienBitmap[c] = alienBitmaps[c]
            this.alienTeam.alienHeight = alienBitmaps[c].height;
            this.alienTeam.alienWidth = alienBitmaps[c].width;            
        }

        this.keyboardListen();
    }

    private keyboardListen() {
        document.addEventListener(
            "keydown",
            (event) => {
                const keyName = event.key;
                if (!this.alienTeam.aliensWin && keyName === "ArrowLeft") {
                    this.player.directionX = -1;
                }
                if (!this.alienTeam.aliensWin && keyName === "ArrowRight") {
                    this.player.directionX = 1;
                }
                if (keyName === " ") {
                    if (!this.alienTeam.aliensWin) {
                        if ( this.player.fire(this.clicks)) {
                            this.fireSound.play();
                        }
                        
                    }
                }
            },
            false
        );

        document.addEventListener(
            "keyup",
            (event) => {
                const keyName = event.key;
                if (keyName === "ArrowLeft" || keyName === "ArrowRight") {
                    this.player.directionX = 0;
                }
            },
            false
        );
    }

    draw() {
        const mainCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        let ctx = mainCanvas.getContext("2d", { alpha: false })

        if (mainCanvas != null && ctx != null ) { 
            this.doDraw(mainCanvas,ctx)
        }
    }
    doDraw(mainCanvas:HTMLCanvasElement,ctx: CanvasRenderingContext2D) {

        this.clicks++;

        if (this.alienTeam.aliens.length == 0) {
            this.player.level++;
            this.alienTeam.createTeamOfAliens();
        }


        this.player.playerHitAlien(this.alienTeam);

        this.alienTeam.alienBulletProcess(this.player, this.screenWidth, this.screenHeight);
  
        if (!this.alienTeam.aliensWin) {
            this.alienTeam.moveAlienTeamAlong(this.screenWidth, this.screenHeight, this.player.level);
        } 
        this.player.update(this.screenWidth, this.screenHeight);

        this.defences.handleBullets(this.player.bullets,this.alienTeam.bullets, this.alienTeam);
    
        ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);

        this.defences.draw(ctx);

        this.alienTeam.draw(ctx);

        ctx.drawImage(this.playerBitmap, this.player.x, this.player.y);

        ctx.fillStyle = "red";
        for (let b of this.player.bullets) {
            ctx.fillRect(b.x, b.y, 6, 10);
        }

        if (this.alienTeam.aliensWin) {
            this.showGameOver(ctx);
        } else {
            this.showCurrentGameStats(ctx);
        }
        if ( this.player.lives == 0  ) {
            this.alienTeam.aliensWin = true;
        }       
        
    }

    private showCurrentGameStats(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "red";
        ctx.font = "24px serif";
        
        const message = `FPS:${Math.round(fps / frameCount)} lives:${this.player.lives} score:${this.player.score}`;
        ctx.fillText(message, 10, 32);
    }

    private showGameOver(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "red";
        ctx.font = "48px serif";
        const message = `Game over lives:${this.player.lives} score:${this.player.score} level:${this.player.level}`;
        ctx.strokeText(message, 10, this.screenHeight/3);
    }


}


let game: Game | null = null;
let secondsPassed: number;
let oldTimeStamp: number;
let fps: number = 0.0;
let frameCount: number = 0;


function runGame(timeStamp: number) {
    frameCount = frameCount + 1;
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;


    let since = Math.round(1 / secondsPassed);
    if (since > 0.0) {
        fps = fps + since;
    }

    if (game != null) {
        game.draw();
    }
    window.requestAnimationFrame(runGame);
}

function loaded() {
    const image = new Image()
    image.src = "game-images.png";
    image.onload = () => {
            Promise.all([
                createImageBitmap(image, 0, 36, 64, 32),
                createImageBitmap(image, 0, 70, 32, 16),
                createImageBitmap(image, 32, 70, 32, 16),
            ]).then((sprites) => {
                const playerBitmap = sprites[0]
                const aliens = [];
                for (let c = 0; c <= 1; c++) {
                    aliens.push(sprites[c + 1])
                }
                game = new Game(playerBitmap,aliens);
                window.requestAnimationFrame(runGame);
            });            
        };
    }


export { loaded }

