/**
 * Created by yangyanjun on 15/9/9.
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

    //清除<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制三角形
    //gl.drawArrays(gl.POINTS, 0, n);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        // 顶点坐标和颜色
         0.0,  0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
         0.5, -0.5, 0.0, 0.0, 1.0
    ]);
    var n = 3; //点的个数为3

    //创建缓冲区对象
    var vertexColorBuffer = gl.createBuffer();
    if (!vertexColorBuffer) {
        console.log("创建位置缓冲区对象失败");
        return -1;
    }

    //将顶点坐标写入缓冲区对象并开启
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);

    //将顶点尺寸写入缓冲区对象并开启
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}