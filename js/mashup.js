//<!--
//Google location API: "https://maps.googleapis.com/maps/api/geocode/json?address=chennai&key=AIzaSyBoPJb_zmSTasju-ve2CGU3nQzZwCgYNik"


// -->

var Header = React.createClass({
	getInitialState: function(){
		return {
			location: this.props.location
		};
	},	
	handleChange: function(location){
		this.props.onUserInput(
	      location
	    );
	},
	render: function(){
		return (
			<ul className="container">
				<li className="item brand">
					<a href="#">API Mashup</a>
				</li>
				<li className="item searchBar">
					<SearchBar onUserInputs={this.handleChange} location={this.state.location} />
				</li>
			</ul>
		);
	}
});

var SearchBar = React.createClass({
	handleTextChange: function(){
		this.props.onUserInputs(
	      this.refs.searchInput.value
	    );
	},
	render: function(){
		return (
			<input type="text" name="search[places]" ref="searchInput" value={this.props.location} onChange={this.handleTextChange} placeholder="Enter location"/>
		);
	}
})

var Body = React.createClass({
	getInitialState: function(){
		return {
			location: this.props.location,
			lat: this.props.lat,
			lng: this.props.lng,
			mapData: this.props.mapData
		};
	},
	render: function(){
		return (
			<div className="body">
				<SearchList mapData={this.props.mapData} />
				<Maps location={this.props.location} lng={this.props.lng} lat={this.props.lat} />
			</div>
		);
	}
});


var SearchList = React.createClass({
	render: function(){
		var data = this.props.mapData.map(function(loc){
			return (
				<ListItem long_name = {loc["address_components"][0]["long_name"]} lat = {loc["geometry"]["location"]["lat"]} />
			);
		});
		return (
			<div className="searchResult">
				{data}
			</div>
		);
	}
});

var ListItem = React.createClass({
	render: function(){
		return(
			<div className="searchItem">
				<h4>{this.props.long_name}</h4>
				Location: 
				<p>Latitude: {this.props.lat}</p>
				<p>Longitute: {this.props.lng}</p>
			</div>
		);
	}
});

var Maps = React.createClass({
	render: function(){
		return (
			<div className="maps">
				<div id="map">
				</div>
			</div>
		);
	}
});

var Container = React.createClass({
	getInitialState: function(){
		return {
			location: 'Chennai',
			lat: 13.0826802,
			lng: 80.27071840000001,
			mapData: {}
		};
	},
	handleUserInput: function(location){
		this.setState({
			location: location,
		});
		this.getCoordinates(location);
		this.updateMap();
	},
	getCoordinates: function(location){
		var coordinate="";
		$.ajax({
			url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+location+'&key=AIzaSyBoPJb_zmSTasju-ve2CGU3nQzZwCgYNik',
			method: 'post',
			success: function(data){
				coordinate=data;
				this.setState({
					lat: coordinate["results"][0]["geometry"]["location"]["lat"], 
					lng: coordinate["results"][0]["geometry"]["location"]["lng"],
					mapData: data["results"]
				});		
			}.bind(this),
			error:  function(data){

			}
		});
	},
	updateMap: function(){
		var map;
		var lat = this.state.lat;
		var lng = this.state.lng;
		function initMap(){
		  map = new google.maps.Map(document.getElementById('map'), {
		    center: {lat: parseFloat(lat), lng: parseFloat(lng)},
		    zoom: 8
		  });
		};
		initMap();
	},
	render: function(){
		return (
			<div>
				<Header onUserInput={this.handleUserInput} />
				<Body location={this.state.location} lat={this.state.lat} lng = {this.state.lng} mapData={this.props.mapData} />
			</div>
		);
	}
})

ReactDOM.render(
	<Container />,
	document.getElementsByTagName('body')[0]
);