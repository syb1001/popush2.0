function HomeLangCtrl($scope, $translate, $cookies, LANGS) {
	$scope.langs = LANGS;

	$scope.useLanguage = function(key) {
		$translate.uses(key);
		$cookies.language = $translate.uses();
	};
}