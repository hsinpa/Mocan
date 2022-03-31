import './stylesheet/main.scss';

import DebugCanvas from './Utility/DebugCanvas';
import MocanAR from './MocanAR';
import {FilesLoader} from './Utility/UtilityMethod';
import {ShaderConfigStruct, MaterialList} from './Utility/WebGL/WebglType';

window.onload = async () => {

    let config_filePaths = [ "./config/shader_sets.json"];
    let config_files = await FilesLoader(config_filePaths);


    let shaderConfigStruct : MaterialList = config_files[0];
    let canvasID = "#webgl_canvas";
    let debugID = "#debug_canvas";

    console.log(shaderConfigStruct);  

    let debugCanvas = new DebugCanvas(debugID);
    let mocanAR = new MocanAR(canvasID);

    await mocanAR.SetUp(shaderConfigStruct);

    mocanAR.Render();
    // debugCanvas.DrawDots(cornerData, 1, 1);
};