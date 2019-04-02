import React, { Component, Fragment } from "react";
import Button from "@material-ui/core/Button";
import ModalCreatePlaylist from "../ModalCreatePlaylist/ModalCreatePlaylist";

const BASE_URL = "https://app-songbook.firebaseio.com/";

class CreatePlaylist extends Component {
	state = {
		isCreating: false,
		isEditing: false,
		playlist: {
			title: "",
			songs: []
		}
	};

	// static getDerivedStateFromProps(props, state) {
	// 	if (
	// 		props.selectedSongs.length !== state.playlist.songs.length &&
	// 		props.selectedSongs.length !== 0
	// 	) {
	// 		console.log("here props");
	// 		return {
	// 			playlist: {
	// 				title: props.title,
	// 				songs: props.selectedSongs
	// 			}
	// 		};
	// 	}

	// 	if (Boolean(props.editedPlaylist.id) !== state.isEditing) {
	// 		return {
	// 			...state,
	// 			playlist: props.editedPlaylist,
	// 			isEditing: true
	// 		};
	// 	}

	// 	return null;
	// }

	// handleChange = e => {
	// 	if (this.props.editedPlaylist.id) {
	// 		console.log("here");
	// 		this.setState({
	// 			...this.state,
	// 			playlist: {
	// 				...this.props.editedPlaylist,
	// 				title: e.target.value
	// 			}
	// 		});
	// 	} else {
	// 		this.setState({
	// 			...this.state,
	// 			playlist: {
	// 				...this.state.playlist,
	// 				title: e.target.value
	// 			}
	// 		});
	// 	}
	// };

	// handleFormSubmit = e => {
	// 	e.preventDefault();

	// 	if (this.state.playlist.id) {
	// 		fetch(`${BASE_URL}/playlists/${this.state.playlist.id}.json`, {
	// 			method: "PUT",
	// 			body: JSON.stringify(this.state.playlist)
	// 		}).then(() => alert("Playlist edited successfully"));
	// 	} else {
	// 		fetch(`${BASE_URL}/playlists.json`, {
	// 			method: "POST",
	// 			body: JSON.stringify({ ...this.state.playlist })
	// 		})
	// 			.then(() => {
	// 				alert("Added playlist successfully");
	// 			})
	// 			.catch(() => alert("Error has occurred"));
	// 	}
	// };

	handleCreate = () => {
		this.setState({ isCreating: true });
	};

	handleClose = () => {
		const { closeEditedPlaylist } = this.props;
		this.setState({ isCreating: false, isEditing: false, editedPlaylist: "" });

		closeEditedPlaylist();
	};

	// onDragEnd = result => {
	// 	const { destination, source, draggableId } = result;
	// 	const { songs } = this.state.playlist;

	// 	if (!destination) {
	// 		return;
	// 	}

	// 	if (destination.index === source.index) {
	// 		return;
	// 	}

	// 	const newSongsIds = Array.from(this.state.playlist.songs);
	// 	newSongsIds.splice(source.index, 1);
	// 	newSongsIds.splice(
	// 		destination.index,
	// 		0,
	// 		songs.find(song => song.id === draggableId)
	// 	);

	// 	this.setState({
	// 		playlist: {
	// 			...this.state.playlist,
	// 			songs: newSongsIds
	// 		}
	// 	});
	// };

	render() {
		const {
			isCreating,
			playlist: { songs = [], title = "" }
		} = this.state;

		const { selectedSongs = [], editedPlaylist = "" } = this.props;

		return (
			<Fragment>
				<Button
					variant="outlined"
					style={{ height: "40px" }}
					onClick={this.handleCreate}
				>
					DODAJ PLAYLISTĘ
				</Button>
				{isCreating && (
					<ModalCreatePlaylist
						selectedSongs={selectedSongs}
						editedPlaylist={editedPlaylist}
						isCreating={isCreating}
					/>
				)}

				{/* <Modal
						open={this.state.open || this.state.isEditing}
						disableBackdropClick={true}
					>
						<ContainerCreatePlaylist>
							<WrapperInModal>
								<FormWrapper>
									<form onSubmit={this.handleFormSubmit}>
										<TextField
											id="outlined-full-width"
											label="Nazwa"
											name="nazwa"
											onChange={this.handleChange}
											value={title}
											autoComplete="off"
											placeholder="Podaj nazwę dla playlisty"
											margin="normal"
											fullWidth
											variant="outlined"
											InputLabelProps={{
												shrink: true
											}}
										/>
										<SongsContainer songs={songs} />
										<Button type="submit">Zatwierdź</Button>
										<Button onClick={this.handleClose}>Wyjdź</Button>
									</form>
								</FormWrapper>
							</WrapperInModal>
						</ContainerCreatePlaylist>
					</Modal> */}
			</Fragment>
		);
	}
}

export default CreatePlaylist;
