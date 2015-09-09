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
    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0,  0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);
    var n = 3; //点的个数为3

    var sizes = new Float32Array([
        10.0, 20.0, 30.0 //点的尺寸
    ]);

    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("创建位置缓冲区对象失败");
        return -1;
    }

    var sizeBuffer = gl.createBuffer();
    if (!sizeBuffer) {
        console.log("创建尺寸缓冲区对象失败");
        return -1;
    }

    //将顶点坐标写入缓冲区对象并开启
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    //将顶点尺寸写入缓冲区对象并开启
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if(a_PointSize < 0) {
        console.log('Failed to get the storage location of a_PointSize');
        return -1;
    }
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize);

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}