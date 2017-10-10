!function(_) {
    //Object.create()兼容，摘自MDN
    if (typeof Object.create != 'function') {
      Object.create = (function() {
        function Temp() {}
        var hasOwn = Object.prototype.hasOwnProperty;
        return function (O) {
          if (typeof O != 'object') {
            throw TypeError('Object prototype may only be an Object or null');
          }
          Temp.prototype = O;
          var obj = new Temp();
          if (arguments.length > 1) {
            var Properties = Object(arguments[1]);
            for (var prop in Properties) {
              if (hasOwn.call(Properties, prop)) {
                obj[prop] = Properties[prop];
              }
            }
          }
          return obj;
        };
      })();
    }
    // 课程列表的模板
    var template = 
        '<div class="m-course">\
             <a href="#"><img src="" alt="课程图片"></a>\
             <h3><a href="#">混音全揭秘 舞曲实战篇 揭秘音乐揭秘音乐揭秘音乐</a></h3>\
             <p class="u-provider"><a href="#">音频帮</a></p>\
             <span><i>510</i></span>\
             <p class="u-price">￥800.00</p>\
         </div>';
    // 课程列表详情的模板
    var template2 = 
        '<div class="m-courseHover">\
             <div class="top">\
                 <a href="#"><img src="" alt="课程图片"></a>\
                 <div class="right">\
                     <h3><a href="#">手绘画系列课程</a></h3>\
                     <span><i>57</i>人在学</span>\
                     <p class="u-provider">发布者：<a href="#">几分钟网</a></p>\
                     <p class="u-category">分类：<a href="#">手绘设计</a></p>\
                 </div>\
             </div>\
             <div class="bottom">\
                <p class="u-description">生活中不乏有很多美好的画面，何不用画笔记录下来呢？那么就跟几分钟网一起来记录美好画面吧！</p> \
             </div>\
         </div>';
    // 热门推荐的模板
    var template3 = 
        '<div class="m-course2">\
             <a href="#"><img class="f-fl" src="" alt="课程图片"></a>\
             <h3><a href="#">舞曲揭秘音乐揭秘舞曲揭秘音乐揭秘</a></h3>\
             <span><i>21567</i></span>\
         </div>';
    function Course(options) {
        this.options = options || {};
        // 即 div.m-course 节点
        this.container = this._layout.cloneNode(true);
        // img节点 用于设置src属性
        this.cImg = this.container.querySelector('img');
        // h3节点，用于设置课程名称
        this.cTitle = this.container.querySelector('h3 a');
        // 用于设置课程发布机构以及链接
        this.cProvider = this.container.querySelector('.u-provider a');
        // 用于设置课程在学人数
        this.cLearnerCount = this.container.querySelector('span i');
        // 用于设置课程价格
        this.cPrice = this.container.querySelector('.u-price');
        // 用于存放定时器ID
        this.intervalID = null;
        // 将options 复制到 组件实例上
        _.extend(this, this.options);
        this._setContent();
        this._createCourseHover && this._createCourseHover();
        this._initEvent && this._initEvent();
    }

    _.extend(Course.prototype,{
        _layout: _.html2node(template),
        // 设置课程各项内容
        _setContent: function(){
          if(this.photoUrl) this.cImg && (this.cImg.src = this.photoUrl);
          // 小图路径
          if(this.smallPhotoUrl) this.cSmallImg && (this.cSmallImg.src = this.smallPhotoUrl);
          if(this.name) this.cTitle && (this.cTitle.innerHTML = this.name);
          if(this.provider) this.cProvider && (this.cProvider.innerHTML = this.provider);
          if(this.providerLink) this.cProvider && (this.cProvider.href = this.providerLink);
          if(this.learnerCount) this.cLearnerCount && (this.cLearnerCount.innerHTML = this.learnerCount);
          if(typeof this.price == 'number') this.cPrice && (this.cPrice.innerHTML = this.price == 0 ? '免费' : '￥' + this.price);
          // 用于courseHover的内容设置
          if(this.categoryName !== undefined) this.cCategory && (this.cCategory.innerHTML = String(this.categoryName));
          if(this.description) this.cDescription && (this.cDescription.innerHTML = this.description);
        },
        //创建courseHover
        _createCourseHover: function() {
            this.courseHover = new CourseHover(this.options);
            this.container.appendChild(this.courseHover.container);
        },

        // 初始化事件
        _initEvent: function(){
            var that = this;
          _.addEvent(this.container,
            'mouseover', function() {
                var i = 0;
                clearInterval(that.intervalID);
                that.intervalID = setInterval(function() {
                    if(i > 50) {
                        clearInterval(that.intervalID);
                        that.courseHover.container.style.display = 'block';
                    } else{
                        i++;
                    }
                }, 20)
            });
          _.addEvent(this.container, 'mouseout', function() {
            clearInterval(that.intervalID);
            that.courseHover.container.style.display = 'none';
          })
          _.addEvent(this.courseHover.container, 'mouseover', function() {
            that.courseHover.container.style.display = 'block';
          });
          _.addEvent(this.courseHover.container, 'mouseout', function() {
            that.courseHover.container.style.display = 'none';
          });
        }
    });
    

    // CourseHover类
    function CourseHover(options) {
        Course.call(this,options);
        // 用于设置课程分类；
        this.cCategory = this.container.querySelector('.u-category a');
        // 用于设置课程描述
        this.cDescription = this.container.querySelector('.u-description');
        this._setContent();
    }

    CourseHover.prototype = Object.create(Course.prototype);
    CourseHover.prototype._layout = _.html2node(template2);
    CourseHover.prototype._initEvent = null;
    CourseHover.prototype._createCourseHover = null;

    //Course2类
    function Course2(options) {
        Course.call(this,options);
        this.cImg = null;
        this.cSmallImg = this.container.querySelector('img');
        this._setContent();
    }
    Course2.prototype = Object.create(Course.prototype);
    Course2.prototype._layout = _.html2node(template3);
    Course2.prototype._initEvent = null;
    Course2.prototype._createCourseHover = null;

    window.Course = Course;
    window.Course2 = Course2;
}(util);