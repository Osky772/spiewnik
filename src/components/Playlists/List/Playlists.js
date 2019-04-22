import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
	PlaylistItem,
	ListContainer,
	PageWrapper
} from "../../containers/StyledContainers";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import SearchForm from "../../SharedComponents/SearchForm";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { db } from "../../../App";
import { withStyles } from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import toRenderProps from "recompose/toRenderProps";

const WithWidth = toRenderProps(withWidth());

const BASE_URL = "https://app-songbook.firebaseio.com/";

const styles = theme => ({
	wrapper: {
		[theme.breakpoints.down("xs")]: {
			paddingTop: 0
		}
	},
	playlistsContainer: {
		padding: 10
	},
	playlistTitle: {
		fontSize: 18,
		padding: "15px 15px 5px 15px"
	},
	playlistDescription: {
		padding: "0px 15px 15px 15px"
	},
	link: {
		textDecoration: "none"
	},
	categoriesContainer: {
		[theme.breakpoints.down("xs")]: {
			margin: 10
		},
		[theme.breakpoints.down("sm")]: {
			margin: 10
		}
	},
	categoryTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15
	}
});

class Playlists extends Component {
	state = {
		inputValue: "",
		playlists: [],
		editedPlaylist: {},
		isEditing: false,
		isPublic: true
	};

	getPublicPlaylists = () => {
		fetch(`${BASE_URL}/playlists.json`)
			.then(r => r.json())
			.then(playlists => {
				const arrayPlaylists =
					playlists &&
					Object.keys(playlists).map(key => ({
						id: key,
						...playlists[key]
					}));
				this.setState({ playlists: arrayPlaylists || [] });
			});
	};

	getPrivatePlaylists = () => {
		const { user } = this.props;
		db.ref(`users/${user.uid}/playlists`)
			.once("value")
			.then(snapshot => {
				const playlists = snapshot.val();
				const arrayPlaylists =
					playlists &&
					Object.keys(playlists).map(key => ({
						id: key,
						...playlists[key]
					}));
				this.setState({ playlists: arrayPlaylists || [] });
			});
	};

	componentDidMount() {
		this.getPublicPlaylists();
	}

	handleInputChange = e => {
		this.setState({ inputValue: e.target.value });
	};

	handleCategorySelect = category => {
		if (category === "public") {
			this.setState({ isPublic: true });
			this.getPublicPlaylists();
		}
		if (category === "private") {
			this.setState({ isPublic: false });
			this.getPrivatePlaylists();
		}
	};

	render() {
		const { inputValue = "", playlists = [], isPublic } = this.state;
		const { classes, user } = this.props;

		const searchedPlaylists = playlists.filter(playlist => {
			const playlistTitle = playlist.title.toLowerCase();
			const searchText = inputValue.trim().toLowerCase();
			return playlistTitle.includes(searchText);
		});

		return (
			<WithWidth>
				{({ width }) => (
					<PageWrapper className={classes.wrapper}>
						<Grid container spacing={width === "sm" || width === "xs" ? 0 : 24}>
							<Grid item md={4} xs={12}>
								<Paper className={classes.categoriesContainer}>
									<List component="nav" style={{ background: "white" }}>
										<ListItem
											button
											onClick={() => this.handleCategorySelect("public")}
										>
											<ListItemText primary={"publicze"} />
										</ListItem>
										<ListItem
											button
											onClick={
												user ? () => this.handleCategorySelect("private") : null
											}
										>
											<ListItemText primary={"prywatne"} />
										</ListItem>
									</List>
								</Paper>
							</Grid>
							<Grid item md={8} xs={12}>
								<ListContainer className={classes.playlistsContainer}>
									<Typography className={classes.categoryTitle}>
										{isPublic ? "Playlisty publiczne" : "Playlisty prywatne"}
									</Typography>
									<SearchForm
										handleChange={this.handleInputChange}
										label="Wyszukaj playlistę"
										placeholder="Wpisz nazwę playlisty"
									/>
									{searchedPlaylists.map(playlist => (
										<PlaylistItem key={playlist.id}>
											<Link
												key={playlist.id}
												to={
													isPublic
														? `/playlisty/${playlist.id}`
														: `users/${user.uid}/playlists/${playlist.id}`
												}
												className={classes.link}
											>
												<Typography className={classes.playlistTitle}>
													{playlist.title}
												</Typography>
												<Typography className={classes.playlistDescription}>
													{playlist.songs !== undefined &&
														playlist.songs.map(
															({ performer, title, id }, nr, songs) =>
																nr < songs.length - 1 ? (
																	<span key={id}>
																		{performer
																			? performer + " - " + title
																			: title}
																		{", "}
																	</span>
																) : (
																	<span key={id}>
																		{performer
																			? performer + " - " + title
																			: title}
																	</span>
																)
														)}
												</Typography>
											</Link>
										</PlaylistItem>
									))}
								</ListContainer>
							</Grid>
						</Grid>
					</PageWrapper>
				)}
			</WithWidth>
		);
	}
}

export default withStyles(styles)(Playlists);
