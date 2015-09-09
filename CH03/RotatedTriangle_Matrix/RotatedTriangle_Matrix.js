/**
 * Created by yangyanjun on 15/9/8.
 */

var VSHADER_SOURCE = document.getElementById('vertex-shader').text;
var FSHADER_SOURCE = document.getElementById('fragment-shader').text;

//旋转角度
var ANGLE = 90;

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

    //将平移距离传输给顶点着色器
    var radian = Math.PI * ANGLE / 180.0; //转成弧度制
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    //WebGL中的矩阵是列主序的

    //旋转矩阵
    //var xformMatrix = new Float32Array([
    //     cosB, sinB, 0.0, 0.0,
    //    -sinB, cosB, 0.0, 0.0,
    //      0.0,  0.0, 1.0, 0.0,
    //      0.0,  0.0, 0.0, 1.0
    //]);

    //平移矩阵
    var Tx = 0.5, Ty = 0.5, Tz = 0.0;
    var xformMatrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
         Tx,  Ty,  Tz, 1.0
    ]);

    //缩放矩阵
    //var Tx = 0.5, Ty = 0.5, Tz = 1.0;
    //var xformMatrix = new Float32Array([
    //     Tx, 0.0, 0.0, 0.0,
    //    0.0,  Ty, 0.0, 0.0,
    //    0.0, 0.0,  Tz, 0.0,
    //    0.0, 0.0, 0.0, 1.0
    //]);

    //将旋转矩阵传输给顶点着色器
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);


    //设置<canvas>的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0,  0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);
    var n = 3; //点的个数为4

    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("创建缓冲区对象失败");
        return -1;
    }

    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('获取a_Position失败');
        return -1;
    }

    //将缓冲区对象分配给a_Position对象
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //链接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n;
}