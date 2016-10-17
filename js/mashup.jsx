//<!--
//Google location API: "https://maps.googleapis.com/maps/api/geocode/json?address=chennai&key=AIzaSyBoPJb_zmSTasju-ve2CGU3nQzZwCgYNik"

//-->
"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

const Container = React.createClass({
	getInitialState: function(){
		return {
			location: 'Chennai',
			lat: '80.27',
			lng: '13.084',
			mapData: {},
			query: "Pizza"
		};
	},
	componentDidMount: function(){
		this.getCoordinates(this.state.location);
		this.updateMap();
		this.foursquare();
	},
	handleUserInput: function(location, query){
		this.setState({
			location: location,
			query: query
		});
		this.getCoordinates(location);
		this.updateMap();
		this.foursquare();
	},
	getCoordinates: function(location){
		var coordinate="";
		$.ajax({
			url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+this.state.location+'&key=AIzaSyBoPJb_zmSTasju-ve2CGU3nQzZwCgYNik',
			method: 'get',
			success: function(data){
				coordinate=data;
				this.setState({
					lat: coordinate["results"][0]["geometry"]["location"]["lat"], 
					lng: coordinate["results"][0]["geometry"]["location"]["lng"],
				});		
			}.bind(this),
			error:  function(data){
			}
		});
	},
	foursquare: function(){
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/search?ll='+this.state.lat+','+this.state.lng+'&query='+this.state.query+'&client_secret=HRDKFPHCHB3VXRKAKZEI0UJBDTKTGPJKJ1VKG3VR11MSI2OI&client_id=G32Z1SB20LPG1UJRLBQV1PKXKTAQV0WIJS50A2F3BD4CKVHN&v=20160623',
			method: 'get',
			dataType: 'json',
			success: function(data){
				this.setState({
					mapData: data
				});
			}.bind(this),
			error: function(data){

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
				<Header onUserInput={this.handleUserInput} location = {this.state.location} query={this.state.query} />
				<Body location={this.state.location} lat={this.state.lat} lng = {this.state.lng} mapData={this.state.mapData} />
				<div className="footer">
				    Created by: Sahil Prajapati | 
				    <a href="https://github.com/sahil290791/api_mashup"><i className="fa fa-fw fa-github"></i></a>
				    <a href="https://in.linkedin.com/in/sahil290791"><i className="fa fa-fw fa-linkedin"></i></a>
				    <a href="https://twitter.com/@sahilprjpt206"><i className="fa fa-fw fa-twitter"></i></a>
				</div>
			</div>
		);
	}
});


const Header = React.createClass({
	getInitialState: function() {
		return {
			location: this.props.location,
			query: this.props.query
		};
	},
	handleLocationChange: function(location){
		this.props.onUserInput(
	      location,this.state.query
	    );
	    this.setState({location: location});
	},
	handleQueryChange: function(query){
		this.props.onUserInput(
	      this.state.location, query
	    );
	    this.setState({query: query});
	},
	render: function(){
		return (
			<ul className="container">
				<li className="item brand">
					<a href="/api_mashup/">Find what you are looking for!</a>
				</li>
				<li className="item">
					<ul>
						<li className="">
							<span>Looking for </span>
							<QueryBox onUserSelection={this.handleQueryChange}/>
						</li>
						<li className="searchBar">
							<span> in </span>
							<SearchBar onUserInputs={this.handleLocationChange} />
						</li>
					</ul>
				</li>
			</ul>
		);
	}
});

const QueryBox = React.createClass({
	getInitialState: function() {
		return {
			query: "Pizza"
		};
	},
	handleTextChange: function(e){
		this.props.onUserSelection(
				e.target.value
			);
		this.setState({ query: e.target.value});
	},
	render: function(){
		return (
				<input type="text" ref="query" value={this.state.query} className="queryBox" onChange={this.handleTextChange} placeholder="Search for" />
			);
	}
});

const SearchBar = React.createClass({
	getInitialState: function() {
		return {
			location: "Chennai"
		};
	},
	handleTextChange: function(e){
		this.props.onUserInputs(
	      e.target.value
	    );
	    this.setState({ location: e.target.value});
	},
	render: function(){
		return (
			<input type="text" name="search[places]" ref="searchInput" value={this.state.location} onChange={this.handleTextChange} placeholder="Enter location"/>
		);
	}
})

const Body = React.createClass({
	render: function(){
		return (
			<div className="body">
				<SearchList mapData={this.props.mapData} />
				<Maps location={this.props.location} lng={this.props.lng} lat={this.props.lat} />
			</div>
		);
	}
});


const SearchList = React.createClass({
	render: function(){
		var list = this;
		if (this.props.mapData.hasOwnProperty("response") && this.props.mapData["response"]["venues"].length > 0 ){

			var data = this.props.mapData["response"]["venues"].map(function(venue){
				return (
					<ListItem placeName = {venue["name"]} location={venue["location"]}/>		
				);
			});
			return (
				<div className="searchResult">
					{data}
				</div>
			);
		}
		else{
			return (
				<div className="searchResult">
					<div className="searchItem">
						No near by places found
					</div>
				</div>
			);
		}
	}
});

const ListItem = React.createClass({
	render: function(){
		return(
			<div className="searchItem" >
				<a onClick={this.handleClick}  href="#" data-title={this.props.placeName} data-lng={this.props.location['lng']} data-lat={this.props.location['lat']}>{this.props.placeName}</a>
				<p className="small">{this.props.location["formattedAddress"].join(", ")}: </p>
			</div>
		);
	},
	handleClick: function(e){
		this.setState({
			lat: e.target.getAttribute("data-lat"),
			lng: e.target.getAttribute("data-lng")
		});
		var latLng = {lat: parseFloat(e.target.getAttribute("data-lat")), lng: parseFloat(e.target.getAttribute("data-lng"))};
		function initMap(){
			var map = new google.maps.Map(document.getElementById('map'), {
		    center: latLng,
		    zoom: 20
		  });
		  var marker = new google.maps.Marker({
		    position: latLng,
		    map: map,
		    title: e.target.getAttribute("data-title")
		  });

		};
		initMap();
	}
});

const Maps = React.createClass({
	render: function(){
		return (
			<div className="maps">
				<div id="map">
				</div>
			</div>
		);
	}
});


export default Container;

