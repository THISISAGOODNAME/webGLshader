/**
 * Created by yangyanjun on 15/9/17.
 */

var VSHADER_SOURCE = document.getElementById('vertex-shader').text;
var FSHADER_SOURCE = document.getElementById('fragment-shader').text;

function main() {
    var canvas = document.getElementById('webgl');

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log("获取webGL渲染内容失败");
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Shader初始化失败");
        return;
    }

    //设置顶点位置
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('设置顶点位置失败');
        return;
    }

    //设置<canvas>的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    if (!initTextures(gl, n)) {
        console.log('贴图初始化失败');
        return;
    }
}

function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
        // 顶点坐标,纹理坐标
        -0.5,  0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5,  0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);
    var n = 4; //顶点的个数为3

    //创建缓冲区对象
    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
        console.log("创建位置缓冲区对象失败");
        return -1;
    }

    //将顶点坐标和纹理坐标写入缓冲区对象并开启
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    //将纹理坐标分配给a_TexCoord并开启他
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (a_TexCoord < 0) {
        console.log('Failed to get the storage location of a_TexCoord');
        return -1;
    }
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}

function initTextures(gl, n) {
    var texture0 = gl.createTexture(); //创建纹理对象
    if (!texture0) {
        console.log('Failed to create the texture object');
        return false;
    }

    var texture1 = gl.createTexture(); //创建纹理对象
    if (!texture1) {
        console.log('Failed to create the texture object');
        return false;
    }

    //获取u_Sampler的存储位置
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return false;
    }
    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler1');
        return false;
    }

    var image0 = new Image(); //创建一个Image对象
    if (!image0) {
        console.log('Failed to create the image object');
        return false;
    }
    var image1 = new Image(); //创建一个Image对象
    if (!image1) {
        console.log('Failed to create the image object');
        return false;
    }

    //注册图像加载事件的响应函数
    image0.onload = function () {
        loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
    };
    image1.onload = function () {
        loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
    };

    //浏览器开始加载图像
    image0.src = '../../resources/sky.jpg';
    image1.src = '../../resources/circle.gif';
    return true;
}

//标记纹理单元是否已经就绪
var g_texUnit0 = false, g_texUnit1 = false;
function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //对纹理进行y轴反转

    //激活纹理
    if (texUnit == 0) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    } else {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    }

    //向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    //将unit0纹理传给着色器
    gl.uniform1i(u_Sampler, texUnit);

    gl.clear(gl.COLOR_BUFFER_BIT); //清空<canvas>

    if (g_texUnit0 && g_texUnit1) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    } //绘制矩形

}