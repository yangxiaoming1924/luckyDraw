var turnplate={
    restaraunts:[],				//大转盘奖品名称
    colors:[],					//大转盘奖品区块对应背景颜色
    outsideRadius:192,			//大转盘外圆的半径
    textRadius:155,				//大转盘奖品位置距离圆心的距离
    insideRadius:68,			//大转盘内圆的半径
    startAngle:0,				//开始角度
    count:0,

    bRotate:false				//false:停止;true:旋转
};

$(document).ready(function(){
    //动态添加大转盘的奖品与奖品区域背景颜色
    turnplate.restaraunts = [ "年货红包","夏威夷果一袋", "松子一袋"];
    turnplate.colors = ["#e2e2e2","#1E9FFF", "#5FB878" ];
    turnplate.arr = [0,1,2];



    var rotateTimeOut = function (){
        $('#wheelcanvas').rotate({
            angle:0,
            animateTo:2160,
            duration:8000,
            callback:function (){
                alert('网络超时，请检查您的网络设置！');
            }
        });
    };

    //旋转转盘 item:奖品位置; txt：提示语;
    var rotateFn = function (item, txt){
        var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
        if(angles<270){
            angles = 270 - angles;
        }else{
            angles = 360 - angles + 270;
        }
        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle:0,
            animateTo:angles+1800,
            duration:8000,
            callback:function (){	//回调
                swal({
                    title: '恭喜中奖!',
                    text: `奖品为:${turnplate.restaraunts[item-1]}`,
                    imageUrl: 'images/logo.gif',
                    showCancelButton: true,
                    confirmButtonText: '领取奖品',
                    cancelButtonText: '朕不需要',
                    imageWidth: 400,
                    imageHeight: 150,
                    animation: false
                }).then(function() {
                        swal({
                            title: '领奖信息',
                            html:
                            `<input id="swal-input1" class="swal2-input"  autofocus placeholder="请输入您的姓名">
                              <input id="swal-input2" class="swal2-input" placeholder="请输入您的手机号">
                                奖品:<b id="swal-input3">${turnplate.restaraunts[item-1]}</b>`,
                            showConfirmButton:true,
                            confirmButtonText:'提交',
                            preConfirm: function(result) {
                                return new Promise(function(resolve) {
                                    if (result) {
                                        resolve([
                                            $('#swal-input1').val(),
                                            $('#swal-input2').val(),
                                            $('#swal-input3').val()
                                        ]);
                                    }
                                });
                            }
                        }).then(function() {
                                swal({
                                    title:`提交成功`,
                                    type:'success'
                                });
                        });

                },function (dismiss) {
                    if(dismiss) {
                        swal({
                            title:`您已放弃本次奖品`,
                            type:'warning',
                           confirmButtonText:'朕知道了'
                        });
                    }
                })
            }
        });
    };

    $('.pointer').click(function (){
        if(turnplate.bRotate)return;
        turnplate.count++;
        if(turnplate.count >= 3)
        turnplate.bRotate = !turnplate.bRotate;
        //获取随机数(奖品个数范围内)
        var item = rnd(1,turnplate.arr.length);
        //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
        rotateFn(item, turnplate.restaraunts[item-1]);
        /* switch (item) {
            case 1:
                rotateFn(252, turnplate.restaraunts[0]);
                break;
            case 2:
                rotateFn(216, turnplate.restaraunts[1]);
                break;
            case 3:
                rotateFn(180, turnplate.restaraunts[2]);
                break;
            case 4:
                rotateFn(144, turnplate.restaraunts[3]);
                break;
            case 5:
                rotateFn(108, turnplate.restaraunts[4]);
                break;
            case 6:
                rotateFn(72, turnplate.restaraunts[5]);
                break;
            case 7:
                rotateFn(36, turnplate.restaraunts[6]);
                break;
            case 8:
                rotateFn(360, turnplate.restaraunts[7]);
                break;
            case 9:
                rotateFn(324, turnplate.restaraunts[8]);
                break;
            case 10:
                rotateFn(288, turnplate.restaraunts[9]);
                break;
        } */
        console.log(turnplate.restaraunts[item-1]);
    });
});
//0-6
//[1,2,3,4,5,6,7]
function rnd(n, m){
    var random = Math.floor(Math.random()*(m-n+1)+n);
    return random;

}


//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
window.onload=function(){
    drawRouletteWheel();
};

function drawRouletteWheel() {
    var canvas = document.getElementById("wheelcanvas");
    if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (turnplate.restaraunts.length/2);
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0,0,422,422);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = "#FFBE04";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = 'bold 18px Microsoft YaHei';
        for(var i = 0; i < turnplate.restaraunts.length; i++) {
            var angle = turnplate.startAngle + i * arc;
            ctx.fillStyle = turnplate.colors[i];
            ctx.beginPath();
            //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
            ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
            ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();
            //锁画布(为了保存之前的画布状态)
            ctx.save();

            //改变画布文字颜色
            var b = i+2;
            if(b%2){
                ctx.fillStyle = "#FFFFFF";
            }else{
                ctx.fillStyle = "#E5302F";
            };

            //----绘制奖品开始----


            var text = turnplate.restaraunts[i];
            var line_height = 17;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);

            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);

            /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
            if(text.indexOf("盘")>0){//判断字符进行换行
                var texts = text.split("盘");
                for(var j = 0; j<texts.length; j++){
                    ctx.font = j == 0?'bold 20px Microsoft YaHei':'bold 18px Microsoft YaHei';
                    if(j == 0){
                        ctx.fillText(texts[j]+"盘", -ctx.measureText(texts[j]+"盘").width / 2, j * line_height);
                    }else{
                        ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height*1.2); //调整行间距
                    }
                }
            }else if(text.indexOf("盘") == -1 && text.length>8){//奖品名称长度超过一定范围
                text = text.substring(0,8)+"||"+text.substring(8);
                var texts = text.split("||");
                for(var j = 0; j<texts.length; j++){
                    ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                }
            }else{

                //在画布上绘制填色的文本。文本的默认颜色是黑色

                //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            }

            //添加对应图标

            if(text.indexOf(turnplate.restaraunts[0])>=0){
                var img= document.getElementById("diy1-img");
                img.onload=function(){
                    ctx.drawImage(img,-35,20);
                };
                ctx.drawImage(img,-35,20);
            };
            if(text.indexOf(turnplate.restaraunts[1])>=0){
                var img= document.getElementById("shan-img");
                img.onload=function(){
                    ctx.drawImage(img,-35,20);
                };
                ctx.drawImage(img,-35,20);
            };
            if(text.indexOf(turnplate.restaraunts[2])>=0){
                var img= document.getElementById("diy5-img");
                img.onload=function(){
                    ctx.drawImage(img,-25,35);
                };
                ctx.drawImage(img,-30,35);
            };
            if(text.indexOf(turnplate.restaraunts[3])>=0){
                var img= document.getElementById("shan-img");
                img.onload=function(){
                    ctx.drawImage(img,-35,20);
                };
                ctx.drawImage(img,-35,20);
            };
            if(text.indexOf(turnplate.restaraunts[4])>=0){
                var img= document.getElementById("diy3-img");
                img.onload=function(){
                    ctx.drawImage(img,-30,20);
                };
                ctx.drawImage(img,-30,20);
            };
            if(text.indexOf(turnplate.restaraunts[5])>=0){
                var img= document.getElementById("shan-img");
                img.onload=function(){
                    ctx.drawImage(img,-35,20);
                };
                ctx.drawImage(img,-35,20);
            };
            if(text.indexOf(turnplate.restaraunts[6])>=0){
                var img= document.getElementById("diy2-img");
                img.onload=function(){
                    ctx.drawImage(img,-30,20);
                };
                ctx.drawImage(img,-30,20);
            };

            if(text.indexOf(turnplate.restaraunts[7])>=0){
                var img= document.getElementById("shan-img");
                img.onload=function(){
                    ctx.drawImage(img,-35,20);
                };
                ctx.drawImage(img,-35,20);
            };


            //把当前画布返回（调整）到上一个save()状态之前
            ctx.restore();
            //----绘制奖品结束----
        }
    }
};



