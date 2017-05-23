(function(global, doc, $) {

	// SVGInjector : Style 설정
	var svgInjection = function() {
		// IE8, console.log() 오류 안나게
		if (!window.console) {
			console = {
				log: function() {}
			};
		};
		// img.inject-me 요소 수집해서 mySVGsToInject 변수에 참조
		var mySVGsToInject = doc.querySelectorAll('img.inject-svg');
		// SVG 주입(Injector) 설정 옵션
		var injectorOptions = {
			evalScripts: 'once', // always, once, never
			pngFallback: 'images/ie-png', // PNG 대체 폴더 설정
			each: function(svg) {
				// svg는 수집된 개별 img.inject-me를 가리킴
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

})(window, document, window.jQuery);