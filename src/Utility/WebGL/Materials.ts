import {GLSLDataSet, MaterialDataSet, MaterialList} from './WebglType';
import {Dictionary} from 'typescript-collections';

export default class Materials {
    _materialCache : Dictionary<string, MaterialDataSet>;

    constructor() {
        this._materialCache = new Dictionary();
    }

    public async AsyncSetUp(config: MaterialList) {
        await this.fetech_all_shaders(config.materials);
    }

    public get_shader(name : string) {
        return this._materialCache.getValue(name);
    }

    public async fetch_shaders(name : string, vertFilePath: string, fragFilePath: string) {
        let VertPros = fetch(vertFilePath, {method: 'GET', credentials: 'include'});
        let FragPros = fetch(fragFilePath, {method: 'GET', credentials: 'include'});
    
        return Promise.all([VertPros, FragPros ])
        .then( responses =>
            Promise.all(
                [responses[0].text(), responses[1].text()]
            )
        ).then((values) => {
            let gLSLDataSet : MaterialDataSet = {
                name : name,
                glsl : {
                    vertex_shader : values[0],
                    fragment_shader : values[1],    
                }
            };
            
            return gLSLDataSet; 
        });
    }

    private async fetech_all_shaders(materials : MaterialDataSet[]) {
        if (materials == null) return;

        let promiseArray = [];

        for (let i = 0; i < materials.length; i++) {
            promiseArray.push(this.fetch_shaders(materials[i].name, materials[i].glsl.vertex_shader, materials[i].glsl.fragment_shader));
        }

        let loadedMaterial = await Promise.all(promiseArray).then(responses => responses);
        loadedMaterial.forEach(x => {
            this._materialCache.setValue(x.name, x);
        });
    }
}