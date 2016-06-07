var Header = React.createClass({
	render: function(){
		return (
			<ul className="container">
				<li className="item brand">
					<a href="#">API Mashup</a>
				</li>
				<li className="item searchBar">
					<SearchBar onchange={this.handleChange} />
				</li>
			</ul>
		);
	},
	handleChange: function(){

	}
});

var SearchBar = React.createClass({
	render: function(){
		return (
			<input type="text" name="search[places]" refs="search_place" />
		);
	}
})

ReactDOM.render(
	<Header />,
	document.getElementsByTagName('body')[0]
);