
var PropTypes = require('prop-types');
var Converter = require('./Converter');
var createClass = require('create-react-class');

module.exports = createClass({
	propTypes: {
		markdown: PropTypes.string,
		components: PropTypes.objectOf(PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func
		]))
	},

	render: function() {
		var markdown = this.props.markdown || this.props.markup;
		return new Converter(this.props).convert(markdown);
	},

	converter: Converter
});
