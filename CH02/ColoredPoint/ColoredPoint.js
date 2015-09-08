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

    // 获取a_Position变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log("获取a_Position位置失败");
        return;
    }

    // 获取u_FragColor变量的存储位置
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (u_FragColor < 0) {
        console.log("获取u_FragColor颜色失败");
        return;
    }

    //注册鼠标点击事件
    canvas.onmousedown = function(ev) {
        click(ev, gl, canvas, a_Position, u_FragColor);
    };

    //设置<canvas>的背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = []; //鼠标点击位置数组
var g_colors = []; //存储点颜色的数组
function click(ev, gl, canvas, a_Position, u_FragColor) {
    var x = ev.clientX; //鼠标点击处x坐标
    var y = ev.clientY; //鼠标点击处y坐标
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height/2) / (canvas.height/2);
    y = (canvas.width/2 - (y - rect.top)) / (canvas.width/2);
    //将坐标存储到g_points数组中
    g_points.push([x, y]);

    //将点的颜色存储到g_colors数组中
    if (x >= 0.0 && y >= 0.0) {      // First quadrant
        g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
    } else if (x < 0.0 && y < 0.0) { // Third quadrant
        g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
    } else if (x >= 0.0 && y < 0.0) {// Fourth quadrant
        g_colors.push([0.0, 0.0, 1.0, 1.0]);  // White
    } else {
        g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
    }

    //清除<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for (var i = 0; i < len; i++) {
        var xy = g_points[i];
        var rgba = g_colors[i];

        //将点的位置传递到变量a_Position中
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

        //将点的颜色传输到u_FragColor中
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        //绘制点
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}