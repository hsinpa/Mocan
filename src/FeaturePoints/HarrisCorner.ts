

export default class HarrisCorner {

    private _cacheTexture : ImageData;
    private _k : number;
    private _window_size : number;
    private _threshold : number;

    SetTexture(texture : ImageData) {
        this._cacheTexture = texture;

        this._cacheTexture.data
    }

    SetConfig(k : number, window_size : number, threshold : number) {
        this._k = k;
        this._window_size = window_size;
        this._threshold = threshold;
    }



}