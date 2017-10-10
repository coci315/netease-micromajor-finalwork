!function(_) {
    var template = 
    '<div class="m-tips">\
        <div class="g-wrap">\
            <p class="f-fl"><span>消息内容</span> <a href="#" target="_blank">立即查看&gt;</a></p>\
            <p class="f-fr">不再提醒</p>\
        </div>\
    </div>';

    function Tips(options) {
        options = options || {};
        // 即 div.m-tips 节点
        this.container = this._layout.cloneNode(true);
        // messageBox，用于插入自定义消息
        this.messageBox = this.container.querySelector('p span');
        // a节点，用于设置href
        this.urlBox = this.container.querySelector('p a');
        // 将options 复制到 组件实例上
        _.extend(this, options);
        this._initEvent();
    }

    _.extend(Tips.prototype,{
        _layout: _.html2node(template),
        // 设置消息内容和跳转链接地址
        setContent: function(message,url){
          if(message) this.messageBox.innerHTML = message;
          if(url) this.urlBox.href = url;
        },

        // 显示通知栏
        show: function(message,url) {
          message = message || this.message;
          url = url || this.url;
          this.setContent(message,url);
          var body = document.body;
          body.insertBefore(this.container,body.firstChild);
        },
        // 隐藏通知栏
        hide: function() {
            var container = this.container;
            container.style.height = 0;
            container.style.padding = 0;
            container.innerHTML = '';
        },
        // 初始化事件
        _initEvent: function(){
          _.addEvent(this.container.querySelector('p+p'),
            'click', this.hide.bind(this));
        }
    });
    

    window.Tips = Tips;

}(util);