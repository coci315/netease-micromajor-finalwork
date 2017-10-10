!function(_) {
    function $(selector) {
        return document.querySelector(selector);
    }
    //bind兼容
    if(!Function.prototype.bind){
        Function.prototype.bind = function (obj) {
            // 获取函数本身
            var _func = this,
                // 第一个参数为obj，即函数调用者，第二个参数开始，如果有传入，即需要绑定的参数
                _params = Array.prototype.slice.call(arguments,1);
            // 返回一个函数，这是一个闭包，外部变量可以通过获取这个返回的函数来访问以上两个变量
            return function(){
                // 获取这个返回函数的参数
                var _localParams = Array.prototype.slice.call(arguments);
                // 合并参数，一起传入apply函数
                _params = _params.concat(_localParams);
                _func.apply(obj, _params);
            }
        }
    }
    //trim兼容
    if (!String.prototype.trim) {
      String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');
      };
    }
    // forEach兼容,摘自MDN
    if (!Array.prototype.forEach) {
      Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
        if (this === null) {
          throw new TypeError(' this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
          throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
          T = thisArg;
        }
        k = 0;
        while (k < len) {
          var kValue;
          if (k in O) {
            kValue = O[k];
            callback.call(T, kValue, k, O);
          }
          k++;
        }
      };
    }
    //1.顶部通知条功能
    //获取cookie
    var cookie = _.getCookie();
    //判断cookie是否存在visted，不存在则显示通知条并设置cookie
    if(!cookie['visted']){
        // tips.style.display = 'block';
        var tips = new Tips({
           message:'网易云课堂微专业，帮助你掌握专业技能，令你求职或加薪多一份独特优势！',
           url:'http://study.163.com/smartSpec/intro.htm#/smartSpecIntro' 
        });
        tips.show();
        _.setCookie('visted','true');
    }

    //2.关注+登录功能
    //关注API
    var follow = (function() {
            //开关，是否已关注，初始为false
            var followed = false;
            return function(btn,eleNum) {
                //已关注，则直接返回
                if(followed) return;
                //未关注，则开关置为true
                followed = true;
                //修改按钮内容
                btn.innerHTML = '已关注<span>取消</span>';
                //粉丝数加1
                eleNum.innerHTML = Number(eleNum.innerHTML) + 1;
                //修改样式
                _.addClass(btn,'z-active');
                //设置cookie
                _.setCookie('followSuc','1');
                //取消按钮绑定点击事件
                _.addEvent(btn.querySelector('span'),'click',function(e) {
                    e = e || window.event;
                    //开关置为false
                    followed = false;
                    //修改按钮内容
                    btn.innerHTML = '关注';
                    //粉丝数减1
                    eleNum.innerHTML -= 1;
                    //修改样式
                    _.delClass(btn,'z-active');
                    //清除cookie
                    _.setCookie('followSuc','',-1);
                    //阻止冒泡
                    if(e.stopPropagation) e.stopPropagation();
                    else e.cancelBubble = true;
                });
            }
    })();
    //获取“关注”按钮节点
    var btnFollow = $('.m-logo a');
    //获取粉丝数节点
    var followNums = $('.m-logo span');
    //判断cookie是否存在followSuc，存在则直接调用关注API
    if(cookie['followSuc']) {
        follow(btnFollow,followNums);
    }
    //给关注按钮注册事件
    _.addEvent(btnFollow,'click',function() {
        //判断cookie是否存在loginSuc，用于判断是否登录过，不存在则新建登录框，并弹出
        if(!cookie['loginSuc']) {
            //新建登录框
            var login = new Login({
                action:'http://study.163.com/webDev/login.htm',
                method:'get',
                title:'登录网易云课堂'
            });
            //显示登录框
            login.show();
            //给登录表单注册提交事件
            login.on('onSubmit',function() {
                //调用ajax请求
                _.ajax({
                    method:'get',
                    url:login.action,
                    data:{
                        userName:hex_md5(login.inputU.value), //md5加密
                        password:hex_md5(login.inputP.value)
                    },
                    success: function(mes) {
                        // 登录成功
                        if(mes === '1') {
                            _.setCookie('loginSuc','1');
                            follow(btnFollow,followNums);
                            cookie = _.getCookie();
                            login.hide();
                        // 登录失败
                        }else {
                            login.showMes('用户名或密码有误');
                        }
                    },
                    async: true
                });
            });
        }else{
            // 如果cookie中存在loginSuc，则直接调用关注API
            follow(btnFollow,followNums);
        }
    });

    // 3.轮播图部分
    // 兼容IE8，手动把取到的元素放到数组里
    var pointers = [];
    var imgs = [];
    var elePointers = document.querySelectorAll('.m-slide i');
    var eleImgs = document.querySelectorAll('.m-slide img');
    for(var i = 0;i < elePointers.length; i++) {
        pointers.push(elePointers[i]);
        imgs.push(eleImgs[i]);
    }
    //图片更改为从1开始的顺序
    imgs.reverse();
    //将透明度从0渐进到1，用时500ms
    function changeOpacity(img) {
        var opacity = 0;
        var intervalID = setInterval(function() {
            if(opacity === 100) {
                clearInterval(intervalID);
            }else {
                opacity += 4;
                img.style.opacity = opacity/100;
                img.style.filter = 'alpha(opacity='+opacity+')'; // 兼容低版本IE
            }
        },20)
    }
    //切换图片
    function slide(index) {
        //所有图片透明度改为0，display为none
        imgs.forEach(function(img){
            img.style.opacity = 0;
            img.style.filter = 'alpha(opacity=0)'; // 兼容低版本IE
            img.style.display = 'none';
        });
        //所有切换器去掉选中状态样式
        pointers.forEach(function(pointer) {
            _.delClass(pointer,'z-crt');
        });
        //当前图片对应的切换器增加选中状态样式
        _.addClass(pointers[index],'z-crt');
        //当前图片显示出来，并500ms淡入
        imgs[index].style.display = 'block';
        changeOpacity(imgs[index]);
    }
    //自动切换图片
    function autoSlide(fromIndex) {
        var i = fromIndex;
        var intervalID = setInterval(function() {
            slide(i);
            i = (i+1)%imgs.length;
        }, 5000);
        return intervalID;
    }
    //从第2张开始切换
    var timer = autoSlide(1);
    for(var j = 0; j < imgs.length; j++) {
        //给图片添加索引
        imgs[j].index = j;
        //给切换器添加索引
        pointers[j].index = j;
        //给图片注册mouseover事件
        _.addEvent(imgs[j],'mouseover',function() {
            clearInterval(timer);
        });
        //给图片注册mouseout事件
        _.addEvent(imgs[j],'mouseout',function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            timer = autoSlide((target.index+1)%imgs.length);
        });
        //给切换器注册click事件
        _.addEvent(pointers[j],'click',function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            slide(target.index);
            clearInterval(timer);
            timer = autoSlide((target.index+1)%imgs.length);
        });
    }

    // 4.课程列表及查看详情及分页器
    // 获取课程列表的容器节点
    var courseContainer = $('.m-list');
    // 获取.g-main节点，用于插入分页器
    var eleMain = $('.g-main');
    // 新建分页器，注册切换页码时的change事件
    var page = new Page();
    page.on('change',function() {
        _pageNo = this.curPageNo;
        getAndRenderCourseList(_pageNo,_psize,_type);
    });
    eleMain.appendChild(page.container);
    // 生成课程列表项
    function render(arr,ConstructorFn) {
        if(!arr) return;
        var frag = document.createDocumentFragment();
        for(var i = 0; i < arr.length;i++) {
            var course = new ConstructorFn({
                photoUrl:arr[i].middlePhotoUrl,
                smallPhotoUrl:arr[i].smallPhotoUrl,
                name:arr[i].name,
                provider:arr[i].provider,
                providerLink:arr[i].providerLink,
                learnerCount:arr[i].learnerCount,
                price:arr[i].price,
                categoryName:arr[i].categoryName,
                description:arr[i].description
            });
            frag.appendChild(course.container);
        }
        return frag;
    }
    // 根据ajax获取的数据生成课程列表
    function getAndRenderCourseList(pageNo,psize,type,callback) {
        _.ajax({
            method:'get',
            url:'http://study.163.com/webDev/couresByCategory.htm',
            success:function(mes){
                var obj = JSON.parse(mes);
                // 获取返回的总页数
                _totalPage = obj.totalPage;
                // 设置分页器的总页数
                page.setTotalPage(_totalPage);
                // 清空课程列表
                courseContainer.innerHTML = '';
                // 重新插入新的课程列表
                obj.list && courseContainer.appendChild(render(obj.list,Course));
                callback && callback(); 
            },
            data:{
                pageNo: pageNo,
                psize: psize,
                type: type
            },
            async:true
        });
    }
    // 初始化参数
    var flag1 = true, // 小于等于1204px时的开关
        flag2 = true, // 大于1204px时的开关
        _totalPage,
        _pageNo = 1,
        _psize,
        _type = 10;

    // 5.根据视口大小，调整课程列表
    // 根据视口大小来渲染数据
    function renderByWindowWidth(){
            // 获取视口大小
            var windowWidth = window.innerWidth || document.documentElement.clientWidth;
            if(flag1 && windowWidth <= 1204) {
                courseContainer.style.overflow = 'hidden';
                _psize = 15;
                getAndRenderCourseList(_pageNo,_psize,_type,function(){
                   courseContainer.style.overflow = 'visible';
                });
                flag1 = false;
                flag2 = true;
            }
            if(flag2 && windowWidth > 1204) {
                _psize = 20;
                getAndRenderCourseList(_pageNo,_psize,_type);
                flag2 = false;
                flag1 = true;
            }
        }
    renderByWindowWidth();
    // 注册resize事件，调整窗口大小时，根据视口大小重新渲染数据
    _.addEvent(window,'resize',renderByWindowWidth);

    // 6.点击选项卡切换
    // 获取选项卡节点
    var eleTabs = document.querySelectorAll('.m-tab li a');
    var tabs = [];
    for(var i = 0;i < eleTabs.length; i++) {
        eleTabs[i].courseType = (i+1)*10;
        tabs.push(eleTabs[i]);
    }
    // 给选项卡注册点击事件
    for(var i = 0;i < eleTabs.length; i++) {
        _.addEvent(eleTabs[i],'click',function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            tabs.forEach(function(tab) {
                _.delClass(tab.parentNode,'z-crt');
            });
            _.addClass(target.parentNode,'z-crt');
            var temp = _type;
            _type = target.courseType;
            if(_type != temp) {
                _pageNo = 1;
                page.reset();
                getAndRenderCourseList(_pageNo,_psize,_type);
            }
        });
    }

    // 7.热门推荐及展示区内容的滚动
    // 获取热门推荐列表下的box节点，用于滚动
    var topListBox = $('.m-list2 .box');
    // 获取展示区下的box节点，用于滚动
    var showBox = $('.m-show .box');
    // 定义滚动方法
    function slideMove(node,style,distance,step,start,end,delay) {
        // var distance = 70;
        // var step = 1;
        var _distance = distance;
        var temp  = parseInt(_.getStyle(node,style));
        clearInterval(node.timer);
        node.timer = setInterval(function(){
            if(distance === 0) {
                clearInterval(node.timer);
                // top初始值为20px，滚动20次后，为20-20*70=-1380，此时，将top值重置为初始值，即可循环滚动
                if(node.style[style] == end + 'px') {
                    node.style[style] = start + 'px';
                }
                setTimeout(function(){
                    slideMove(node,style,_distance,step,start,end,delay);
                },delay);
            }else{
                distance -= step;
                temp -= step;
                node.style[style] = temp + 'px';
            }
        }, 20)
    }
    //展示区图片滚动
    showBox.innerHTML += showBox.innerHTML;
    //开始滚动
    setTimeout(function() {
        slideMove(showBox,'left',324,1,0,-1620,2000);
    }, 0);
    // 获取热门推荐数据并生成列表
    _.ajax({
        method:'get',
        url:'http://study.163.com/webDev/hotcouresByCategory.htm ',
        success:function(mes){
            var arr = JSON.parse(mes);
            arr.sort(function(a,b){
                return b.learnerCount - a.learnerCount;
            });
            topListBox.appendChild(render(arr,Course2));
            // //复制一份，可使滚动到底部时，不会出现空白
            topListBox.innerHTML += topListBox.innerHTML;
            //开始滚动
            setTimeout(function() {
                slideMove(topListBox,'top',70,1,20,-1380,5000);
            }, 0);
        },
        async:true
    });

    // 8.视频介绍
    // 获取视频截图节点
    var videoShot = $('.m-intro img');
    // 注册点击事件
    _.addEvent(videoShot,'click',function() {
        var videoPlayer = new VideoPlayer({
            link:'http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4'
        });
        videoPlayer.show();
    });

}(util);