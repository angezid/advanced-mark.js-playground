// covert codejar.js to 'umd' format
module.exports = {
	files: 'static/js/codejar.js',
	from: [/^\s*const\s+globalWindow\s*=\s*window\s*;\s*\bexport\s+function\s+CodeJar\(/i, /\}\s*$/],
	to: [`(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if(typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.CodeJar = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function(root) {
    
const globalWindow = window;
function CodeJar(`, `}\nreturn  CodeJar;\n});`]
};
