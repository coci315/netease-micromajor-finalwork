!function(_) {
    var template = 
    '<div class="m-page f-fr">\
         <a class="prev z-disable" href="javascript:void(0)">&nbsp;</a>\
         <a class="page z-crt pager" href="javascript:void(0)">1</a>\
         <a class="page pager" href="javascript:void(0)">2</a>\
         <a class="page pager" href="javascript:void(0)">3</a>\
         <a class="page pager" href="javascript:void(0)">4</a>\
         <a class="page pager" href="javascript:void(0)">5</a>\
         <a class="page pager" href="javascript:void(0)">6</a>\
         <a class="page pager" href="javascript:void(0)">7</a>\
         <a class="page pager" href="javascript:void(0)">8</a>\
         <a class="next" href="javascript:void(0)">&nbsp;</a>\
     </div>';

    function Page(totalPage) {
        this.totalPage = totalPage || 8;
        // 即 div.m-page 节点
        this.container = this._layout.cloneNode(true);
        // curIndex,用于存放当前页码节点的index
        this.curIndex = 0;
        // curPageNo，用于存放当前页码
        this.curPageNo = 1;
        // pagePrev，用于切换上一页
        this.pagePrev = this.container.querySelector('.prev');
        // pageNext，用于切换下一页
        this.pageNext = this.container.querySelector('.next');
        // pages数组,用于存放页码节点
        this.pages = [];
        var elePages = this.container.querySelectorAll('.page');
        for(var i = 0; i < elePages.length; i++) {
            elePages[i].index = i;
            elePages[i].pageNo = i + 1;
            this.pages.push(elePages[i]);
        }
        this._initEvent();
    }

    _.extend(Page.prototype,{
        _layout: _.html2node(template),
        // 更改总页数
        setTotalPage: function(totalPage) {
            var old = this.totalPage;
            this.totalPage = totalPage;
            if((old < 8 && old != totalPage) || (old >= 8 && totalPage < 8)) {
                this.renderPages(totalPage);
            }
        },
        renderPages: function(number) {
            var str = '';
            if(number > 8) number = 8;
            if(number < 1) number = 1;
            var frag = document.createDocumentFragment();
            for(var i = 0; i < number; i++) {
                str = '<a class="page pager" href="javascript:void(0)">'+(i+1)+'</a>';
                frag.appendChild(_.html2node(str));
            }
            var that = this;
            this.pages.forEach(function(page){
                that.container.removeChild(page);
            });
            this.container.insertBefore(frag,this.pageNext);
            // 重新存放新的页码节点
            this.pages = [];
            var elePages = this.container.querySelectorAll('.page');
            for(var i = 0; i < elePages.length; i++) {
                elePages[i].index = i;
                elePages[i].pageNo = i + 1;
                this.pages.push(elePages[i]);
            }
            this.curIndex = Math.min(this.curIndex,this.totalPage-1);
            this.curPageNo = Math.min(this.curPageNo,this.totalPage);
            this.changeStyle4Pages(this.curIndex);
            this.emit('change');
        },
        // 重置为第一页
        reset: function() {
            this.pages[0].pageNo = 1;
            this.curIndex = 0;
            this.curPageNo = 1;
            this.updatePageNos();
            this.changeStyle4Pages(this.curIndex);
            this.changeStyle4PrevAndNext();
        },
        // 更改页码样式
        changeStyle4Pages: function(index){
            this.pages.forEach(function(page) {
                _.delClass(page,'z-crt');
            });
            _.addClass(this.pages[index],'z-crt');
            // this.curIndex = index;
        },

        // 更改上一页下一页的样式
        changeStyle4PrevAndNext: function() {
            if(this.curPageNo == 1) {
                _.addClass(this.pagePrev,'z-disable');
                _.delClass(this.pageNext,'z-disable');
            } else if(this.curPageNo == this.totalPage) {
                _.addClass(this.pageNext,'z-disable');
                _.delClass(this.pagePrev,'z-disable');
            } else {
                _.delClass(this.pagePrev,'z-disable');
                _.delClass(this.pageNext,'z-disable');
            }
        },
        // 根据首页更新页码
        updatePageNos: function() {
            var base = this.pages[0].pageNo;
            this.pages.forEach(function(page,index){
                page.pageNo = base + index;
                page.innerHTML = page.pageNo;
            });
        },
        // 翻页
        goPages: function(number) {
            if(number < 0) {
                this.pages[0].pageNo += number;
                if(this.pages[0].pageNo < 1) this.pages[0].pageNo = 1;
                this.updatePageNos();
            } else if(number > 0) {
                this.pages[this.pages.length-1].pageNo += number;
                if(this.pages[this.pages.length-1].pageNo > this.totalPage) this.pages[this.pages.length-1].pageNo = this.totalPage;
                this.pages[0].pageNo = this.pages[this.pages.length-1].pageNo - (this.pages.length - 1);
                this.updatePageNos();
            }
        },
        // 获取页码索引
        getPageIndex: function(pageNo) {
            for(var i = 0; i < this.pages.length; i++) {
                if(this.pages[i].pageNo == pageNo) {
                    return this.pages[i].index;
                }
            }
        },
        // 初始化事件
        _initEvent: function(){
            var that = this;
          _.addEvent(this.pageNext,
            'click', function() {
                that.curPageNo ++;
                if(that.curPageNo > that.totalPage) that.curPageNo = that.totalPage;
                if(that.curPageNo <= 4) {
                    that.goPages(0);
                } else {
                    that.goPages(1);
                }
                that.curIndex = that.getPageIndex(that.curPageNo);
                that.changeStyle4Pages(that.curIndex);
                that.changeStyle4PrevAndNext();
                that.emit('change');
            });
          _.addEvent(this.pagePrev,
            'click', function() {
                that.curPageNo --;
                if(that.curPageNo < 1) that.curPageNo = 1;
                if(that.curPageNo >= that.totalPage - 4) {
                    that.goPages(0);
                } else {
                    that.goPages(-1);
                }
                that.curIndex = that.getPageIndex(that.curPageNo);
                that.changeStyle4Pages(that.curIndex);
                that.changeStyle4PrevAndNext();
                that.emit('change');
            });
          // this.pages.forEach(function(page,index) {
          //   _.addEvent(page,'click',function(e) {
          //       e = e || window.event;
          //       var target = e.target || e.srcElement;
          //       that.curPageNo = target.pageNo;
          //       that.goPages(index - 3);
          //       that.curIndex = that.getPageIndex(that.curPageNo);
          //       that.changeStyle4Pages(that.curIndex);
          //       that.changeStyle4PrevAndNext();
          //       that.emit('change');
          //   })
          // });
          _.addEvent(this.container,'click',function(e){
            e = e || window.event;
            var target = e.target || e.srcElement;
            if(target.className.indexOf('pager') != -1) {
                that.curPageNo = target.pageNo;
                that.goPages(target.index - 3);
                that.curIndex = that.getPageIndex(that.curPageNo);
                that.changeStyle4Pages(that.curIndex);
                that.changeStyle4PrevAndNext();
                that.emit('change');
            }
          });
        }
    });
    
    // 使用混入Mixin的方式使得Page具有事件发射器功能
    _.extend(Page.prototype, _.emitter);

    window.Page = Page;

}(util);