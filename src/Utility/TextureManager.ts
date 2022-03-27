import {Dictionary} from 'typescript-collections';
import {GetImagePromise} from './UtilityMethod';
import {Texture, Regl} from 'regl';

class TextureManager {
    private _textureCache : Dictionary<string, Texture>;
    private _regl : Regl;

    constructor(regl : Regl) {
        this._textureCache = new Dictionary();
        this._regl = regl;
    }

    async GetREGLTexture(path : string) : Promise<Texture> {
        if (this._textureCache.containsKey(path)) {
            return this._textureCache.getValue(path);
        }

        let hmtlImage = await GetImagePromise(path);
        let texture = this._regl.texture({data:hmtlImage, flipY: true});
        this._textureCache.setValue(path, texture);

        return texture;
    }

    // async GetHTMLImage(path : string) : Promise<HTMLImageElement> {

    //     if (this.textureCache.containsKey(path)) {
    //         return this.textureCache.getValue(path);
    //     }

    //     let texture = await GetImagePromise(path);
    //     this.textureCache.setValue(path, texture);

    //     return texture;         
    // }


}

export default TextureManager;