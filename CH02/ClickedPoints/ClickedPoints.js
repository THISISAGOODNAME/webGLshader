/**
 * Created by yangyanjun on 15/9/6.
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

    // 获取attribute变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log("获取a_Position位置失败");
        return;
    }

    //注册鼠标点击事件
    canvas.onmousedown = function(ev) {
        click(ev, gl, canvas, a_Position);
    };

    //设置<canvas>的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = []; //鼠标点击位置数组
function click(ev, gl, canvas, a_Position) {
    var x = ev.clientX; //鼠标点击处x坐标
    var y = ev.clientY; //鼠标点击处y坐标
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height/2) / (canvas.height/2);
    y = (canvas.width/2 - (y - rect.top)) / (canvas.width/2);
    //将坐标存储到g_points数组中
    g_points.push(x); g_points.push(y);

    //清除<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for (var i = 0; i < len; i += 2) {
        //将点的位置传递到变量a_Position中
        gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

        //绘制点
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}