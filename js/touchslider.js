

;(function(){
    $.fn.touchslider = function(options){
        var defaults = $.extend({},	{
                        scrollObj	  : '',
                        scrollBarWrap : '',
                        scrollBar	  : '',
                        onceScrollH   : 80,
                        recover       : true,
                        ablemove      : true,
                        speed         : 100
                    }, options);
        
        var $boxObj = $(this),
			$contentObj = $(defaults.scrollObj),
			$scrollbarWrap = $(defaults.scrollBarWrap),
			$scrollbar = $(defaults.scrollBar),
            onceH = defaults.onceScrollH,
            recover = defaults.recover,
            scrollSpeed = defaults.speed;
        
        var contentH = $contentObj.outerHeight(false),
			boxH = $boxObj.height(),
			curTop = parseInt($contentObj.css('top')),
			barWrapH = $scrollbarWrap.height(),
			barH = parseInt(boxH/contentH*barWrapH),
			scrollTop = 0,
			barScrollTop = 0,
            sdir, sfirstX, sfirstY;
			
			//$scrollbar.height(barH);
        scrollObjInit();
        function scrollObjInit(){
            contentH = $contentObj.outerHeight(false),
			boxH = $boxObj.height(),
			curTop = parseInt($contentObj.css('top')),
			barWrapH = $scrollbarWrap.height(),
			barH = parseInt(boxH/contentH*barWrapH),
			scrollTop = 0,
			barScrollTop = 0;
			
			$scrollbar.height(barH);
            
            if(contentH < boxH){
                $scrollbarWrap.hide();
            }else{
                $scrollbarWrap.show();
            }
        }
        
        $boxObj.mousewheel(function(event, delta, deltaX, deltaY){
            event.preventDefault();
            scrollObjInit();
            
            if(contentH > boxH){
               if(delta > 0){		//向上滚动
                    if(curTop<0){
                        mousewheelAble = false;
                        scrollTop = onceH;
                        if(curTop+scrollTop > 0){
                            scrollTop = -curTop;
                        }
                        $contentObj.stop().animate({top: '+='+scrollTop}, scrollSpeed, function(){
                            recover && (mousewheelAble = true);
                            //config.setConfigNavSelect(parseInt($contentObj.css('top')));
                        });

                        barScrollTop = parseInt(scrollTop/contentH*barWrapH);
                        $scrollbar.stop().animate({top: '-='+barScrollTop}, scrollSpeed, function(){
                            var boxTop = parseInt($contentObj.css('top'));
                            if(boxTop==0){
                                $scrollbar.css('top', 0);
                                $contentObj.css('top', 0);
                            }
                        });
                    }

                }else{				//向下滚动
                    if(curTop+contentH > boxH){
                        mousewheelAble = false;
                        scrollTop = onceH;
                        if(curTop+contentH-boxH < scrollTop){
                            scrollTop = curTop+contentH-boxH;
                        }
                        $contentObj.stop().animate({top: '-='+scrollTop}, scrollSpeed, function(){
                            recover && (mousewheelAble = true);
                            //config.setConfigNavSelect(parseInt($contentObj.css('top')));
                        });

                        barScrollTop = parseInt(scrollTop/contentH*barWrapH);
                        $scrollbar.stop().animate({top: '+='+barScrollTop}, scrollSpeed, function(){
                            var boxTop = parseInt($contentObj.css('top'));
                            if(boxTop+contentH==boxH){
                                $scrollbar.css('top', barWrapH-barH);
                                $contentObj.css('top', boxH-contentH);
                            }
                        });
                    }				
                } 
                
            }
        });
        
        var istouch = false, firstY;
        $scrollbar.on({
           mousedown : function(e){
               scrollObjInit();
               istouch = true;
               firstY = e.pageY;
               
           }
            
        });
        
        $(document).mouseup(function(e){
            istouch = false;
        });
        
        $(document).mousemove(function(e){
            if(!istouch){
                return false;   
            }
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

            var curY = e.pageY;
            var y = curY - firstY;
            barScrollTop = parseInt($scrollbar.css('top'));
            if(barScrollTop+y <= 0){
               /*$scrollbar.stop().animate({top: '+='+y}, 100);
               $contentObj.stop().animate({top: 0}, 100);*/
               $scrollbar.css('top', 0);
               $contentObj.css('top', 0);

            }else if(barScrollTop+y+barH < barWrapH){ 
               scrollTop = parseInt(y/barWrapH*contentH);
               /*$scrollbar.stop().animate({top: '+='+y}, 100);
               $contentObj.stop().animate({top: '-='+scrollTop}, 100);*/

               $scrollbar.css('top', '+='+y);
               $contentObj.css('top', '-='+scrollTop);


            }else if(barScrollTop+y+barH >= barWrapH){
               /*$scrollbar.stop().animate({top: barWrapH-barH}, 100);
               $contentObj.stop().animate({top: boxH-contentH}, 100);*/

               $scrollbar.css('top', barWrapH-barH);
               $contentObj.css('top', boxH-contentH);

            }

            firstY = curY;
        });
        
        
        //触摸关闭经销商详情
        if(defaults.ablemove){
            $boxObj.on({
                'touchstart': function(e){
                    e.preventDefault();
                    sfirstX = window.event.touches[0].pageX;
                    sfirstY = window.event.touches[0].pageY;
                    startHandler(e);
                },
                'touchmove'	: function(e){
                    e.preventDefault();
                    var sX = window.event.touches[0].pageX;
                    var sY = window.event.touches[0].pageY;
                    moveHandler(e, sX, sY);

                },
                'touchend'	: function(e){
                    endHandler(e);
                },
                'mousedown' : function(e){
                    e.preventDefault();
                    istouch = true;
                    sfirstX = e.pageX;
                    sfirstY = e.pageY;
                    startHandler(e);
                },
                'mousemove' : function(e){
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); 
                    if(!istouch){
                        return false;	
                    }

                    e.preventDefault();
                    var sX = e.pageX;
                    var sY = e.pageY;
                    moveHandler(e, sX, sY);

                },
                'mouseup'	: function(e){
                    endHandler(e);
                    istouch = false;
                }
            });
        }

        function startHandler(e){
            sdir = null;
            scrollObjInit();
        }

        function moveHandler(e, sX, sY){
            var x = sX - sfirstX;
            var y = sY - sfirstY;

            var dT = parseInt($contentObj.css('top'));		
            if(Math.abs(y) > Math.abs(x)){
                (sdir == null) && (sdir = 'vertical');
                if(sdir != 'vertical'){
                    return;
                }

                if(y>0){
                    (dT+y)>0 ? $contentObj.css('top', '+='+y/4) : $contentObj.css('top', '+='+y);
                }else if(y<0){
                    (dT+y+contentH)<boxH ? $contentObj.css('top', '+='+y/4) : $contentObj.css('top', '+='+y);
                }

                if($scrollbarWrap.is(':visible')){
                    dT = parseInt($contentObj.css('top'));
                    var scrollbarTop;
                    if(dT >= 0){
                        scrollbarTop = 0;
                    }else if(dT+contentH<=boxH){				
                        scrollbarTop = barWrapH-barH;
                    }else{
                        scrollbarTop = -parseInt(dT/(contentH-boxH)*(barWrapH-barH));
                    }
                    $scrollbar.css('top', scrollbarTop);
                }

            }

            sfirstY = sY;
            sfirstX = sX;

        }

        function endHandler(e){
            if(sdir == 'vertical'){
                if(parseInt($contentObj.css('top')) > 0){
                    $contentObj.stop(true, false).animate({top: 0}, 300, 'easeOutSine');
                }else if(parseInt($contentObj.css('top'))+contentH < boxH){
                    var _top;
                    if(contentH > boxH){
                        _top = boxH-contentH;
                    }else{
                        _top = 0;
                    }
                    $contentObj.stop(true, false).animate({top: _top}, 300, 'easeOutSine');
                }
            }
        }
    
    }
})(jQuery);


