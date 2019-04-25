import React, { Component, Fragment } from "react";
import { PageWrapper, SongPaper } from "../../containers/StyledContainers";
import { withStyles } from "@material-ui/core/styles";
import Loader from "react-loader-spinner";

const BASE_URL = "https://app-songbook.firebaseio.com/";

export const formatSongDescription = ({ description = "" }) => {
	let verses = description.split("\n");

	const textWithChords = verses.map(verse => {
		const text = verse.split("<")[0] ? verse.split("<")[0].trim() : null;
		const chords = verse.split("<")[1]
			? verse
					.split("<")[1]
					.trim()
					.slice(0, -1)
					.split(",")
					.join(", ")
			: null;
		return { text, chords };
	});

	if (
		textWithChords[textWithChords.length - 1].text === "" &&
		textWithChords[textWithChords.length - 2].text === ""
	) {
		textWithChords.pop();
		textWithChords.pop();
	}

	if (textWithChords[textWithChords.length - 1].text === "") {
		textWithChords.pop();
	}

	return textWithChords;
};

export const styles = theme => ({
	wrapper: {
		zIndex: 9000,
		paddingBottom: 115,
		[theme.breakpoints.down("sm")]: {
			position: "relative",
			paddingTop: 0
		}
	},
	verse: {
		display: "flex",
		justifyContent: "space-between",
		margin: "10px 0"
	},
	text: {
		width: "75%",
		[theme.breakpoints.down("xs")]: {
			width: "70%"
		}
	},
	chords: {
		width: "20%",
		[theme.breakpoints.down("xs")]: {
			width: "25%"
		}
	},
	container: {
		width: "100%",
		padding: 15
	},
	spinnerWrapper: {
		display: "flex",
		justifyContent: "center"
	}
});

class Song extends Component {
	state = {
		song: {},
		fetchInProgress: null
	};

	componentWillMount() {
		const { songId } = this.props.match.params;
		this.setState({ fetchInProgress: true });
		fetch(`${BASE_URL}/songs/${songId}.json`)
			.then(r => r.json())
			.then(song => {
				this.setState({ song, fetchInProgress: false });
			});
	}

	render() {
		let {
			song,
			song: { performer = "", title = "", category = "" },
			fetchInProgress
		} = this.state;
		const { classes } = this.props;
		const textWithChords = formatSongDescription(song);

		return (
			<PageWrapper className={classes.wrapper}>
				<SongPaper className={classes.container}>
					{fetchInProgress ? (
						<div className={classes.spinnerWrapper}>
							<Loader type="Oval" color="#039be5" width={120} height={120} />
						</div>
					) : (
						<Fragment>
							<h2>{performer ? performer + " - " + title : title}</h2>
							<h4>{category}</h4>
							{textWithChords.map((verse, i) => {
								return verse.text !== null ? (
									<p key={i} className={classes.verse}>
										<span className={classes.text}>{verse.text}</span>
										<span className={classes.chords}>
											{verse.chords ? verse.chords : null}
										</span>
									</p>
								) : (
									<br key={i} />
								);
							})}
						</Fragment>
					)}
				</SongPaper>
			</PageWrapper>
		);
	}
}

export default withStyles(styles)(Song);
