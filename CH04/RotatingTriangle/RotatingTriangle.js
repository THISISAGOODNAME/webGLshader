/**
 * Created by yangyanjun on 15/9/9.
 */

var VSHADER_SOURCE = document.getElementById('vertex-shader').text;
var FSHADER_SOURCE = document.getElementById('fragment-shader').text;

//旋转速度(度/秒)
var ANGLE_STEP = 45.0;

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

    //将旋转矩阵传输给顶点着色器
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

    //三角形的当前旋转角度
    var currentAngle = 0.0;

    //创建变换用的Matrix4对象
    var modelMatrix = new Matrix4();

    //开始绘制三角形
    var tick = function() {
        currentAngle = animate(currentAngle); //更新旋转角
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick); //请求浏览器调用tick
    };

    tick();
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

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    //设置旋转矩阵
    modelMatrix.setRotate(currentAngle, 0, 0, 1);

    //将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    //清除<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

//记录上次调用函数的时刻
var g_last = Date.now();
function animate(angle) {
    //计算距离上次调用经过多长时间
    var now = Date.now();
    var elapsed = now - g_last; //单位为毫秒
    g_last = now;

    //根据距离上次调用的时间，更新当前旋转角度
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle %= 360;
}