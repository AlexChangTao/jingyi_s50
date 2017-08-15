/**
 * Slider 鼠标滚动插件
 * @param options
 * @constructor
 */
function Slider(options) {
    var _this = this;

    _this.boxObj = typeof options.boxObj === 'undefined' ? '' : options.boxObj;
    _this.sliderObj = typeof options.sliderObj === 'undefined' ? '' : options.sliderObj;
    _this.scrollbarWrap = typeof options.scrollbarWrap === 'undefined' ? '' : options.scrollbarWrap;
    _this.scrollBar = typeof options.scrollBar === 'undefined' ? '' : options.scrollBar;
    _this.onceScrollHeight = typeof options.onceScrollHeight === 'undefined' ? 80 : options.onceScrollHeight;
    _this.ableMove = typeof options.ableMove === 'undefined' ? false : options.ableMove;
    _this.speed = typeof options.speed === 'undefined' ? 300 : options.speed;
    _this.beforeCallback = typeof options.beforeCallback === 'undefined' ? '' : options.beforeCallback;
    _this.afterCallback = typeof options.afterCallback === 'undefined' ? '' : options.afterCallback;
    _this.callback = typeof options.callback === 'undefined' ? '' : options.callback;
    _this.scale = typeof options.scale === 'undefined' ? 1 : options.scale;
    _this.barFixed = typeof options.barFixed === 'undefined' ? false : options.barFixed;    //滚动条固定高度

    _this.sliderTop = 0;
    _this.barSliderTop = 0;
    _this.sliderDir = '';
    _this.sliderFirstX = 0;
    _this.sliderFirstY = 0;
    _this.isTouch = false;

    _this.init();
}

/*初始化*/
Slider.prototype.init = function (e) {
    var _this = this;
    _this.boxH = $(_this.boxObj).height();
    _this.sliderH = $(_this.sliderObj).outerHeight(false);
    _this.barWrapH = $(_this.scrollbarWrap).height();
    _this.minTop = _this.boxH - _this.sliderH;

    if (isNaN(_this.sliderH) || _this.sliderH == 0 || _this.sliderH < _this.boxH) {
        _this.barH = 0;
        $(_this.scrollbarWrap).hide();
    } else {
        _this.barH = (_this.boxH / _this.sliderH * _this.barWrapH) >> 0;
        $(_this.scrollbarWrap).show();
    }

    if (_this.barFixed) {
        _this.barH = $(_this.scrollBar).height();
    } else {
        $(_this.scrollBar).height(_this.barH);
    }

    if ($.isFunction(_this.beforeCallback) && _this.sliderH > _this.boxH) {
        $(_this.boxObj).mouseenter(function (e) {
            _this.beforeCallback();
        });

        $(_this.boxObj).mousemove(function (e) {
            _this.beforeCallback();
        });
    }

    if ($.isFunction(_this.afterCallback)) {
        $(_this.boxObj).mouseleave(function (e) {
            _this.afterCallback();
        });
    }

    if (typeof $(document).mousewheel !== 'undefined') {
        _this.wheels();
    }

    _this.drags();
    _this.touch();
    _this.timer = null;

    $(window).resize(function () {
        if (_this.timer) {
            clearTimeout(_this.timer);
        }
        _this.timer = setTimeout(_this.resize, 100);
    });

};

/*窗口重置*/
Slider.prototype.resize = function () {
    this.boxH = $(this.boxObj).height();
    this.sliderH = $(this.sliderObj).outerHeight(false);
    this.barWrapH = $(this.scrollbarWrap).height();
    this.barH = (this.boxH / this.sliderH * this.barWrapH) >> 0;

    if (this.boxH - this.sliderH > this.sliderTop) {
        this.sliderTop = this.boxH - this.sliderH;
        this.barSliderTop = this.barWrapH - this.barH;

        $(this.sliderObj).stop().animate({top: this.sliderTop}, this.speed);
        $(this.scrollBar).stop().animate({top: this.barSliderTop}, this.speed);
    }

    if (this.boxH >= this.sliderH) {
        this.sliderTop = this.barSliderTop = 0;
        $(this.sliderObj).stop().animate({top: this.sliderTop}, this.speed);
        $(this.scrollBar).stop().animate({top: this.barSliderTop}, this.speed);
    }
};

/*恢复初始化*/
Slider.prototype.reset = function (e) {
    var _this = this;
    _this.boxH = $(_this.boxObj).height();
    _this.sliderH = $(_this.sliderObj).outerHeight(false);
    _this.barWrapH = $(_this.scrollbarWrap).height();
    _this.minTop = _this.boxH - _this.sliderH;

    if (isNaN(_this.sliderH) || _this.sliderH == 0 || _this.sliderH < _this.boxH) {
        $(_this.scrollbarWrap).hide();
    } else {
        if (!_this.barFixed) {
            _this.barH = (_this.boxH / _this.sliderH * _this.barWrapH) >> 0;
        }
        $(_this.scrollbarWrap).show();
    }

    _this.sliderTop = 0;
    _this.barSliderTop = 0;
    if (!_this.barFixed) {
        $(_this.scrollBar).height(_this.barH);
    }
    $(_this.scrollBar).css('top', _this.barSliderTop);
    $(_this.sliderObj).css('top', _this.sliderTop);
};

//鼠标滑动
Slider.prototype.wheels = function (e) {
    var _this = this,
        scrollCount = 0;

    $(_this.boxObj).mousewheel(function (event, delta, deltaX, deltaY) {
        if (_this.sliderH > _this.boxH) {
            if (delta > 0) {		//向上滚动
                if (_this.sliderTop < 0) {
                    event.preventDefault();
                    _this.sliderTop += _this.onceScrollHeight;

                    if (_this.barFixed) {
                        _this.barSliderTop = Math.abs(_this.sliderTop / (_this.sliderH - _this.boxH) * (_this.barWrapH - _this.barH)) >> 0;
                    } else {
                        _this.barSliderTop = Math.abs(_this.sliderTop / _this.sliderH * _this.barWrapH) >> 0;
                    }

                    if (_this.sliderTop > 0) {
                        _this.sliderTop = _this.barSliderTop = 0;
                    }
                    $(_this.sliderObj).stop().animate({top: _this.sliderTop}, _this.speed);
                    $(_this.scrollBar).stop().animate({top: _this.barSliderTop}, _this.speed, function () {
                        $.isFunction(_this.callback) && _this.callback();
                    });

                    scrollCount = 0;
                } else {
                    if (scrollCount < 2) {
                        event.preventDefault();
                        setTimeout(function () {
                            scrollCount++;
                        }, 100);
                    } else {
                        $.isFunction(_this.afterCallback) && _this.afterCallback();
                    }
                }
            } else {				//向下滚动
                if (_this.sliderTop > _this.boxH - _this.sliderH) {
                    event.preventDefault();
                    _this.sliderTop -= _this.onceScrollHeight;

                    if (_this.boxH - _this.sliderH > _this.sliderTop) {
                        _this.sliderTop = _this.boxH - _this.sliderH;
                    }

                    if (_this.barFixed) {
                        _this.barSliderTop = Math.abs(_this.sliderTop / (_this.sliderH - _this.boxH) * (_this.barWrapH - _this.barH)) >> 0;
                    } else {
                        _this.barSliderTop = Math.abs(_this.sliderTop / _this.sliderH * _this.barWrapH) >> 0;
                    }

                    $(_this.sliderObj).stop().animate({top: _this.sliderTop}, _this.speed);
                    $(_this.scrollBar).stop().animate({top: _this.barSliderTop}, _this.speed, function () {
                        $.isFunction(_this.callback) && _this.callback();
                    });

                    scrollCount = 0;
                } else {
                    if (scrollCount < 2) {
                        event.preventDefault();
                        setTimeout(function () {
                            scrollCount++;
                        }, 100);
                    } else {
                        $.isFunction(_this.afterCallback) && _this.afterCallback();
                    }
                }
            }
        } else {
            $.isFunction(_this.afterCallback) && _this.afterCallback();
        }

    });

};

/*手指滑动*/
Slider.prototype.touch = function (e) {
    var _this = this,
        isTouch = false,
        firstY;

    $(_this.boxObj).on({
        'mousedown': function (event) {
            startHandler(event);
        },
        'mousemove': function (event) {
            moveHandler(event);
        },
        'touchstart': function (event) {
            startHandler(event);
        },
        'touchmove': function (event) {
            moveHandler(event);
        }
    });

    $(document).on({
        'mouseup': function (event) {
            endHandler(event);
        },
        'touchend': function (event) {
            endHandler(event);
        }
    });

    function startHandler(event) {
        isTouch = true;
        event = event || window.event;
        firstY = event.clientY || window.event.touches[0].clientY;
    }

    function moveHandler(event) {
        if (isTouch) {
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

            event = event || window.event;
            var curY = event.clientY || window.event.touches[0].clientY,
                diffY = (curY - firstY) / _this.scale;

            if (diffY > 0) {	//向下
                if (_this.sliderTop < 0) {
                    event.preventDefault();
                    _this.sliderTop += diffY;
                    if (_this.sliderTop > 0) {
                        _this.sliderTop = 0;
                    }

                    if (_this.barFixed) {
                        _this.barSliderTop = Math.abs(_this.sliderTop / (_this.sliderH - _this.boxH) * (_this.barWrapH - _this.barH)) >> 0;
                    } else {
                        _this.barSliderTop = Math.abs(_this.sliderTop / _this.sliderH * _this.barWrapH) >> 0;
                    }
                    $(_this.sliderObj).css({top: _this.sliderTop});
                    $(_this.scrollBar).css({top: _this.barSliderTop});
                }

            } else if (diffY < 0) {		//向上
                if (_this.sliderTop > _this.minTop) {
                    event.preventDefault();
                    _this.sliderTop += diffY;
                    (_this.sliderTop < _this.minTop) && (_this.sliderTop = _this.minTop);
                    //_this.barSliderTop = Math.abs(_this.sliderTop/_this.sliderH*_this.barWrapH) >> 0;
                    if (_this.barFixed) {
                        _this.barSliderTop = Math.abs(_this.sliderTop / (_this.sliderH - _this.boxH) * (_this.barWrapH - _this.barH)) >> 0;
                    } else {
                        _this.barSliderTop = Math.abs(_this.sliderTop / _this.sliderH * _this.barWrapH) >> 0;
                    }
                    $(_this.sliderObj).css({top: _this.sliderTop});
                    $(_this.scrollBar).css({top: _this.barSliderTop});
                }
            }

            firstY = curY;
        }
    }

    function endHandler(event) {
        isTouch = false;
    }

};

/*拖动滚动条*/
Slider.prototype.drags = function (event) {
    var _this = this;
    $(_this.scrollBar).on({
        mousedown: function (e) {
            _this.isTouch = true;
            _this.sliderFirstY = e.clientY;
        }
    });

    $(document).mousemove(function (e) {
        if (_this.isTouch) {
            e.preventDefault();
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

            var curY = e.clientY,
                diffY = curY - _this.sliderFirstY;

            _this.barSliderTop += diffY;
            //_this.sliderTop = -(_this.barSliderTop / _this.barWrapH * _this.sliderH) >> 0;
            if (_this.barFixed) {
                _this.sliderTop = -Math.abs(_this.barSliderTop / (_this.barWrapH - _this.barH) * (_this.sliderH - _this.boxH)) >> 0;
            } else {
                _this.sliderTop = -(_this.barSliderTop / _this.barWrapH * _this.sliderH) >> 0;
            }

            if (_this.barSliderTop <= 0) {
                _this.barSliderTop = _this.sliderTop = 0;

            } else if (_this.barSliderTop > _this.barWrapH - _this.barH) {
                _this.barSliderTop = _this.barWrapH - _this.barH;
                _this.sliderTop = _this.boxH - _this.sliderH;
            }

            $(_this.scrollBar).css('top', _this.barSliderTop);
            $(_this.sliderObj).css('top', _this.sliderTop);

            _this.sliderFirstY = curY;
        }
    });

    $(document).mouseup(function (e) {
        if (_this.isTouch) {
            _this.isTouch = false;
            $.isFunction(_this.callback) && _this.callback();
        }
    });

};

/*滚动到指定位置*/
Slider.prototype.scrollTo = function (top) {
    var _this = this;
    this.sliderTop = top;

    if (this.sliderTop > 0) {
        this.sliderTop = 0;
    } else if (this.boxH - this.sliderH > this.sliderTop) {
        this.sliderTop = this.boxH - this.sliderH;
    }

    this.barSliderTop = Math.abs(this.sliderTop / this.sliderH * this.barWrapH) >> 0;
    $(this.sliderObj).stop().animate({top: this.sliderTop}, this.speed);
    $(this.scrollBar).stop().animate({top: this.barSliderTop}, this.speed);

};

/*到顶部*/
Slider.prototype.toTop = function () {
    this.sliderTop = 0;
    this.barSliderTop = 0;

    $(this.sliderObj).stop().animate({top: this.sliderTop}, this.speed);
    $(this.scrollBar).stop().animate({top: this.barSliderTop}, this.speed);
};

/*到底部*/
Slider.prototype.toBottom = function () {
    this.sliderTop = this.boxH - this.sliderH;
    this.barSliderTop = this.barWrapH - this.barH;

    $(this.sliderObj).stop().animate({top: this.sliderTop}, this.speed);
    $(this.scrollBar).stop().animate({top: this.barSliderTop}, this.speed);
};



