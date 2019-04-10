import React, { Component, Fragment } from "react";
import Header from "./components/Header";
import Playlists from "./components/Playlists/Playlists";
import SongsList from "./components/SongsList/SongsList";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Route } from "react-router-dom";
import Song from "./components/Song";
import InitPage from "./components/InitPage";
import Playlist from "./components/Playlists/Playlist";
import * as firebase from "firebase";
import AdminPanel from "./components/Admin/AdminPanel";

var config = {
	apiKey: "AIzaSyC8W028Pyt7eD2EXrvnqlAmXSD0zB007t4",
	authDomain: "app-songbook.firebaseapp.com",
	databaseURL: "https://app-songbook.firebaseio.com",
	projectId: "app-songbook",
	storageBucket: "app-songbook.appspot.com",
	messagingSenderId: "666603805553"
};
firebase.initializeApp(config);

// var serviceAccount = require("./admin-key.json");

// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount),
// 	databaseURL: "https://app-songbook.firebaseio.com"
// });

// admin.auth().getUserByEmail("");

export const db = firebase.database();

class App extends Component {
	state = {
		user: null,
		song: "",
		selectedSongs: []
	};

	handleSelectSongs = selectedSongs => {
		this.setState({ selectedSongs });
	};

	componentDidMount() {
		const ref = firebase.auth().onAuthStateChanged(user =>
			this.setState({
				user
			})
		);

		this.setState({
			ref
		});
	}

	componentWillUnmount() {
		this.state.ref && this.state.ref();
	}

	render() {
		const { selectedSongs, user } = this.state;
		console.log(this.state.user);

		return (
			<Fragment>
				<CssBaseline />
				{/* // Todo: handle app bar tab highligh on links */}
				<Header
					selectedSongs={selectedSongs}
					handleSelectSongs={this.handleSelectSongs}
					user={user}
				/>
				<Route exact path="/" render={props => <InitPage {...props} />} />
				<Route path={"/lista-piosenek/:songId"} component={Song} />
				<Route
					exact
					path="/lista-piosenek"
					render={props => (
						<SongsList
							handleSelectSongs={this.handleSelectSongs}
							selectedSongs={selectedSongs}
							{...props}
						/>
					)}
				/>
				<Route exact path="/playlisty" component={Playlists} />
				<Route
					path={"/playlisty/:playlistId"}
					render={props => (
						<Playlist
							{...props}
							selectedSongs={selectedSongs}
							handleSelectSongs={this.handleSelectSongs}
						/>
					)}
				/>
				<Route path={"/to-approve"} component={AdminPanel} />
			</Fragment>
		);
	}
}

export default App;
