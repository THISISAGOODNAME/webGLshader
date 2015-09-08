/**
 * Created by yangyanjun on 15/9/6.
 */

function main() {
    //获取canvas元素
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log("获取<canvas>元素失败");
        return;
    }

    //获取二维图形的绘图上下文
    var ctx = canvas.getContext('2d');

    //绘制蓝色矩形
    ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';
    ctx.fillRect(120, 10, 150, 150);
}