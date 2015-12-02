
var React = require('react');

var Converter = require('./Converter');

module.exports = React.createClass({
	propTypes: {
		markdown: React.PropTypes.string,
		components: React.PropTypes.objectOf(React.PropTypes.element).isRequired
	},

	render: function() {
		var markdown = this.props.markdown || this.props.markup;
		return new Converter(this.props).convert(markdown);
	},

	converter: Converter
});
