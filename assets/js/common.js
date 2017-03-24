/*! common.js v1.0.0 © inyoung524@naver.com */

(function(global, doc, $) {

    // SVGInjector : Style 설정
    // [참고] https://github.com/iconic/SVGInjector
    var svgInjection = function() {
        // img.inject-me 요소 수집해서 mySVGsToInject 변수에 참조
        var mySVGsToInject = doc.querySelectorAll('img.svg');
        // SVG 주입(Injector) 설정 옵션
        var injectorOptions = {
            evalScripts: 'once', // always, once, never
            pngFallback: 'images/svg/png', // PNG 대체 폴더 설정
            each: function(svg) {
                // svg는 수집된 개별 img.svg를 가리킴
            }
        };
        // SVGInjector 함수에 연결
        SVGInjector(
            // 수집된 img.inject-me 요소
            mySVGsToInject,
            // SVG 주입(Injector) 설정 옵션
            injectorOptions,
            // 콜백 함수
            function(totalSVGsInjected) {
                // totalSVGsInjected는 SVG 주입된 설정 개수를 출력
            });
    };
    svgInjection();

})(window, document, window.jQuery);