
$(function() {
    dealer.load();


});

var dealer = {
    selectedPro: undefined,
    slider: undefined,
    load: function() {
        var self = this;
        $.ajax({
            url: "xml/dealer.xml",
            type: "get",
            dataType: "xml",
            success: function (data) {
                self.data = $(data);
                var list = '';
                $.each($(data).find("Province"), function(i, e) {
                    list += '<li><a href="javascript:;">'+ $(e).attr("name") +'</a></li>';
                });
                $('#infoNavList').html(list);
                self.selectedPro = $('#infoNavList').find('li').eq(0).text();
                $('#infoNavList').find('li').eq(0).addClass('cur');

                self.getInfoByPro(self.selectedPro);
                self.bindHandler();
            }
        })
    },
    getInfoByPro: function(pro) {
        var self = this;
        var infoList = '';
        $.each(self.data.find("Province"), function(i, e) {
            if ($(e).attr("name") == pro) {
                $.each($(e).find("Shop"), function(index, element) {
                    infoList += '<li>'+
                                    '<div class="dealer_title">'+ $(element).find("Name").text() +'</div>'+
                                    '<div class="dealer_tel">电话：<strong>'+ $(element).find("Tel").text() +'</strong></div>'+
                                    '<div class="dealer_address">地址：'+ $(element).find("Address").text() +'</div>'+
                                '</li>';
                });
            }
        });
        $('#infoList').html(infoList);
        $('#infoList').height($('#infoList>li:eq(0)').outerHeight(true) * Math.ceil($('#infoList>li').length/2));

        if (self.slider === undefined) {
            self.slider = new Slider({
                boxObj : '#infoBox',
                sliderObj : '#infoList',
                scrollbarWrap : "#infoScrollbarWrap",
                scrollBar : "#infoScrollbar",
                barFixed : true,        //滚动条固定高度
                onceScrollHeight : 120,
                scale: 1,
                beforeCallback: function(){isScroll = false;},
                afterCallback: function(){isScroll = true; phototrue = true;}
            });
        } else {
            self.slider.reset();
        }
    },
    bindHandler: function() {
        var self = this;
        $('#infoNavList > li').click(function() {
            if ($(this).hasClass('cur')) {
                return;
            }

            $(this).addClass('cur').siblings().removeClass('cur');
            var pro = $(this).find('a').text();
            self.getInfoByPro(pro);
        });
    }
};
