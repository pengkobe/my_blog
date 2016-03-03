    var finishedload = false;
    var lockloading=false;
    var lastdate = new Date();

    lastdate.setDate(lastdate.getDate()-10);

    document.getElementsByClassName("page")[0].onclick=function(e){
        if(e.srcElement.name == 'edit'){
            var id = e.srcElement.id;
            var title = e.srcElement.title;
            document.getElementById("edit_title_form").action='task/'+id+'/edit';
            document.getElementById("editInput").value=title;
            document.getElementById("BgDiv").style.display="block";
            document.getElementById("BgDiv").style.height=document.body.scrollHeight;
            document.getElementsByClassName("popuplayer")[0].style.display="block";
        }
    }

    document.getElementById("cancelEdit").onclick=function(e){
            document.getElementById("BgDiv").style.display="none";
            document.getElementsByClassName("popuplayer")[0].style.display="none";
    }

    var xmlHttpReq = null; 
    function getAjaxReq(){
        if (window.ActiveXObject) { 
          xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP"); 
        } 
        else if (window.XMLHttpRequest) { 
          xmlHttpReq = new XMLHttpRequest(); 
        } 
        return xmlHttpReq;
    }

    // window 滚动事件
    window.onscroll = function () { 
         if (xmlHttpReq == null) { 
             xmlHttpReq=getAjaxReq();
         }
         if (getScrollTop() + getClientHeight() == getScrollHeight()) { 
         //加载完成后不再请求
            if(!finishedload){
                // 锁住后不再请求
                if(!lockloading){
                     lockloading=true;
                     document.getElementById('loading_div').style.display="block";
                     // 2s后解锁
                     setTimeout(function(){
                        lockloading=false;
                        document.getElementById('loading_div').style.display="none";
                        console.log('lock released!');
                     },2000);
                         //设置请求（没有真正打开，true：表示异步 
                        xmlHttpReq.open("post", "/tasks/five", true); 
                        xmlHttpReq.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
                        xmlHttpReq.onreadystatechange = function () { 
                          onajaxtest(xmlHttpReq); 
                        }; 
                        //提交请求 
                        var fullyear = lastdate.getFullYear();
                        var month =  lastdate.getMonth() +1;
                        var day =  lastdate.getDate();
                        var datestr= fullyear+ "/" + (month< 10 ? '0' + month: month) + "/" + (day< 10 ? '0' + day : day);
                        console.log('send...');
                        xmlHttpReq.send(encodeURI("lastdate="+datestr)); 
                     }
                  }
        } 
    }

    function onajaxtest(req) { 
        // 处理返回的结果
        console.log('readyState:'+req.readyState);
        if(req.readyState==4 && req.status==200){
           var data =eval(xmlHttpReq.responseText);
           console.log(data);
           if(data.length == 0){
                finishedload=true;
                document.getElementById('loading_div').style.display="block";
                document.getElementById('loading_div').innerHTML='已全部加载完成.';
                // 2s后解锁
                setTimeout(function(){
                    document.getElementById('loading_div').style.display="none";
                },2000);
                console.log('finishedload');
                return;
           }
           else{
                loadlines(data);
                lastdate.setDate(lastdate.getDate()-5);
           }
        }
        //显示请求过程
        // var newnode = document.createElement("a"); 
        // newnode.setAttribute("href", "#"); 
        // newnode.innerHTML = req.readyState + " " + req.status + " " + req.responseText; 
        // document.body.appendChild(newnode); 
        // var newline = document.createElement("br"); 
        // document.body.appendChild(newline); 
    } 

    // 滚动加载
    function loadlines(data){
        var lastDate = '0'; 
        var html='';
           for (var i = 0, len = data.length; i < len; i++) {
                var task = data[i];
                var status = task.finished ? 'class="finished"' : '';
               if (lastDate !== task.createTime.day) { 
                    html+='<li class="title-li"><span class="title-day"> '+task.createTime.day +'</span></li>';
                    lastDate=task.createTime.day; 
                 } 

                html+='<li  '+status+' >';
                   if (!task.finished) { 
                        html+='<h4><span class="unfinish-title">'+  task.title  +'</span>';
                        if (task.isPrivate) { 
                          html+='<em tabindex="0" class="privatetag">私</em>';
                        }
                        html+='</h4>';
                        html+='<span class="time">创建: '+task.createTime.minute+'  </span>&nbsp;';
                        html+='<a href="/task/'+task._id+'/finish">完成</a>&nbsp';
                   } else { 
                        html+='<h4><del> '+task.title+' </del> ';
                        if (task.isPrivate) { 
                          html+='<em tabindex="0" class="privatetag">私</em>';
                        }
                        html+='</h4>';
                        html+='<span class="time">创建: '+task.createTime.minute+ ' </span>&nbsp;';
                        html+='<span class="time">完成:'+ task.finishTime.minute+'  </span>&nbsp;';
                        html+='<a href="/task/'+task._id+'/recover">恢复</a>&nbsp';
                   } 
                   html+='<a name="edit" id="'+task._id+'" title="'+task.title+'" href="#">修改</a>&nbsp;';
                   var deleteNotice="删除以后不能恢复的，确定？";
                   html+='<a href="/task/'+task._id+'/delete" onclick="return confirm('+deleteNotice+')">删除</a>';
                   html+='</li>';
          }
          console.log(html);
          document.getElementById("task_ul").appendHTML(html);
     }

     // 拓展dom实现appendhtml方法,参考自:http://www.zhangxinxu.com/wordpress/2013/05/js-dom-basic-useful-method/
     HTMLElement.prototype.appendHTML = function(html) {
            var divTemp = document.createElement("div"), nodes = null
                // 文档片段，一次性append，提高性能
                , fragment = document.createDocumentFragment();
            divTemp.innerHTML = html;
            nodes = divTemp.childNodes;
            for (var i=0, length=nodes.length; i<length; i+=1) {
               fragment.appendChild(nodes[i].cloneNode(true));
            }
            this.appendChild(fragment);
            // 据说下面这样子世界会更清净
            nodes = null;
            fragment = null;
    };

     //获取滚动条当前的位置 
    function getScrollTop() { 
        var scrollTop = 0; 
        if (document.documentElement && document.documentElement.scrollTop) { 
          scrollTop = document.documentElement.scrollTop; 
        } 
        else if (document.body) { 
          scrollTop = document.body.scrollTop; 
        } 
        return scrollTop; 
    } 

    //获取当前可视范围的高度 
    function getClientHeight() { 
        var clientHeight = 0; 
        if (document.body.clientHeight && document.documentElement.clientHeight) { 
          clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight); 
        } 
        else { 
          clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight); 
        } 
        return clientHeight; 
    } 

    //获取文档完整的高度 
    function getScrollHeight() { 
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); 
    } 