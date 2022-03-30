export default class DebugCanvas {
    _canvas : HTMLCanvasElement;
    _ctx : CanvasRenderingContext2D;

    _dot_size = 10;

    constructor(canvas_query : string) {
        this._canvas = document.querySelector(canvas_query);
        this._ctx = this._canvas.getContext("2d");
    }

    SetSize(width : number, height : number) {
        this._canvas.width = width;
        this._canvas.height = height;
    }

    DrawDots(dot_array : number[][], scale_x : number, scale_y : number) {
        let dotCount = dot_array.length;

        for (let i = 0; i < dotCount; i++) {
            this.DrawDot(dot_array[i][0] * scale_x, dot_array[i][1] * scale_y);
        }
    }

    DrawDot(x : number, y : number) {
        this._ctx.beginPath();
        this._ctx.arc(x, y, this._dot_size ,0,2*Math.PI);
        this._ctx.fillStyle = 'green';
        this._ctx.fill();
    }
}