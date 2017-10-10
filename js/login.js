!function(_) {
    // 两个i元素只针对IE8，因为IE8不支持placeholder
    var template =
    '<div class="m-login">\
        <form action="" method="get">\
            <span></span>\
            <em></em>\
            <i class="text">帐号</i>\
            <i class="pass">密码</i>\
            <h3>登录框标题</h3>\
            <fieldset>\
                <input class="userName" type="text" name="userName" placeholder="帐号">\
                <input class="password" type="password" name="password" placeholder="密码">\
                <button>登 录</button>\
            </fieldset>\
        </form>\
    </div>';

    function Login(options) {
        options = options || {};
        // 即 div.m-login 节点
        this.container = this._layout.cloneNode(true);
        // form节点 用于设置action method属性
        this.form = this.container.querySelector('form');
        // h3节点，用于设置登录框标题
        this.formTitle = this.container.querySelector('h3');
        //用户名输入框节点
        this.inputU = this.container.querySelector('.userName');
        //密码输入框节点
        this.inputP = this.container.querySelector('.password');
        //em节点，用于设置表单验证提示消息
        this.em = this.container.querySelector('em');
        // 将options 复制到 组件实例上
        _.extend(this, options);
        this._initEvent();
    }

    _.extend(Login.prototype,{
        _layout: _.html2node(template),
        // 设置表单action method属性以及标题内容
        setContent: function(action,method,title){
          if(action) this.form.action = action;
          if(method) this.form.method = method;
          if(title) this.formTitle.innerHTML = title;
        },

        // 显示登录框
        show: function(action,method,title) {
            action = action || this.action;
            method = method || this.method;
            title = title || this.title;
            this.setContent(action,method,title);
            document.body.appendChild(this.container);
        },
        // 隐藏登录框
        hide: function() {
            document.body.removeChild(this.container);
        },
        //显示指定提示信息
        showMes: function(mes) {
            this.em.innerHTML = mes;
        },
        //验证用户名
        checkU: function() {
            if(! /^[a-z0-9]{6,16}$/i.test(this.inputU.value)){
                this.showMes('帐号为6-16位数字或字母');
            }else {
                this.showMes('');
            }
            return /^[a-z0-9]{6,16}$/i.test(this.inputU.value);
        },
        //验证密码
        checkP: function() {
           if(! /^\S{6,16}$/.test(this.inputP.value)){
               this.showMes('密码为6-16位字符');
           }else {
               this.showMes('');
           } 
           return /^\S{6,16}$/.test(this.inputP.value);
       },
        // 初始化事件
        _initEvent: function(){
          var that = this;
          //关闭按钮注册点击事件
          _.addEvent(this.container.querySelector('span'),
            'click', this.hide.bind(this));
          //输入框注册input事件，IE下用onpropertychange
          var testinput = document.createElement('input');      
          if('oninput' in testinput){  
              this.inputU.addEventListener("input",this.checkU.bind(this),false);
              this.inputP.addEventListener("input",this.checkP.bind(this),false);  
          }else{ 
              //兼容IE 
              this.inputU.onpropertychange = this.checkU.bind(this);
              this.inputP.onpropertychange = this.checkP.bind(this);  
          }
          _.addEvent(this.form,'submit',function(e) {
            //阻止默认事件，即阻止表单提交
            e = e || window.event;
            if(e.preventDefault) e.preventDefault();
            else e.returnValue = false;
            //表单验证不通过，则直接返回
            if(!that.checkU() || !that.checkP() ) return;
            that.emit('onSubmit');
          });  
        }
    });

    // 使用混入Mixin的方式使得Login具有事件发射器功能
    _.extend(Login.prototype, _.emitter);
    

    window.Login = Login;

}(util);