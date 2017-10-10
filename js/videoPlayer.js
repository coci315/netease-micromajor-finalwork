!function(_) {
    var template =
    '<div class="m-videoPlayer">\
        <div class="box">\
            <span></span>\
            <h3>请观看下面的视频</h3>\
            <video controls autoplay>\
                <source class="videoLink" src="">\
                您的浏览器不支持video标签。\
            </video>\
        </div>\
    </div>';

    function VideoPlayer(options) {
        options = options || {};
        // 即 div.m-VideoPlayer 节点
        this.container = this._layout.cloneNode(true);
        // h3节点，用于设置标题
        this.videoTitle = this.container.querySelector('h3');
        //source节点，用于设置视频链接
        this.videoLink = this.container.querySelector('.videoLink');
        // 将options 复制到 组件实例上
        _.extend(this, options);
        this._initEvent();
    }

    _.extend(VideoPlayer.prototype,{
        _layout: _.html2node(template),
        // 设置视频标题以及链接
        setContent: function(title,link){
          if(title) this.videoTitle.innerHTML = title;
          if(link) this.videoLink.src = link;
        },

        // 显示视频窗口
        show: function(title,link) {
            title = title || this.title;
            link = link || this.link;
            this.setContent(title,link);
            document.body.appendChild(this.container);
        },
        // 隐藏视频窗口
        hide: function() {
            document.body.removeChild(this.container);
        },
        // 初始化事件
        _initEvent: function(){
          _.addEvent(this.container.querySelector('span'),
            'click', this.hide.bind(this));
        }
      });

    window.VideoPlayer = VideoPlayer;

}(util);