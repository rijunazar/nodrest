/** @author riju.nazar
* @email rinzar@gmail.com
**/
var parse = require('url').parse;

exports.merge = function (o1, o2) {
	var keys;
	if (o1 && o2) {
		for (keys in o2) {
			o1[key] = o2[key];
		}
	}
	return o1;
};


exports.parseURL = function (req) {
	
};

