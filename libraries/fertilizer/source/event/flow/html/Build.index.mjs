
(function(lychee, global) {

	let blob = ${blob};


	let environment = lychee.deserialize(blob);
	if (environment !== null) {
		environment.init();
	}

	lychee.ENVIRONMENTS['${id}'] = environment;

	export default = environment;

})(lychee, typeof global !== 'undefined' ? global : this);