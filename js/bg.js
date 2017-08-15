// bgImg
var _window = $(window);
var bgImg = $(".bgImg");
var bgImgWid = 1920;
var bgImgHei = 900;
function setBgImg() {
    var winWid = _window.width();
    var winHei = _window.height();
    var winSize = winWid / winHei;
    var imgSize = bgImgWid / bgImgHei;
    if (winSize < imgSize) {
        var leftPos = (winWid - winHei * imgSize) / 2;
        bgImg.css({"height": "100%", "width": "auto", "top": "0", "left": leftPos + "px"});
    } else if (winSize == imgSize) {
        bgImg.css({"width": "100%", "height": "100%", "top": "0", "left": "0"});
    } else {
        var topPos = (winHei - winWid / imgSize) / 2;
        bgImg.css({"width": "100%", "height": "auto", "top": topPos + "px", "left": "0"});
    }
}
setBgImg();
_window.resize(function () {
    setBgImg();
});