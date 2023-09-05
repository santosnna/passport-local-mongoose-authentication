/** Receives a function and returns the same function wrapped with a .catch() handling asynchronous errors.
 * I am assuming:
 * 	1. It uses the "longer" syntax to avoid problematic behaviours from the arrow syntax.
 * 	2. It passes express objects as arguments to the original function in case that didn't have the "next" object
 */
module.exports = (fn) => {
	return function (req, res, next) {
		fn(req, res, next).catch((error) => {
			next(error);
		});
	};
};
