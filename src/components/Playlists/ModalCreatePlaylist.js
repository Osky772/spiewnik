import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import {
	WrapperInModal,
	FormWrapper,
	ContainerModal
} from "../containers/StyledContainers";
import { DragDropContext } from "react-beautiful-dnd";
import SongsContainer from "./SongsContainer";
import InfoSnackBar from "../InfoSnackBar";
import ErrorValidateInfo from "../CreateSongModal/ErrorValidateInfo";

const BASE_URL = "https://app-songbook.firebaseio.com/";

class ModalCreatePlaylist extends Component {
	state = {
		isCreating: false,
		isEditing: false,
		isError: false,
		playlist: {
			id: null,
			title: "",
			songs: []
		}
	};

	static getDerivedStateFromProps(props, state) {
		// To create new playlist
		if (
			props.isCreating &&
			props.selectedSongs !== undefined &&
			state.playlist.songs.length === 0 &&
			props.selectedSongs.length !== 0 &&
			props.isEditing !== true &&
			state.isEditing !== true
		) {
			return {
				...state,
				isCreating: true,
				playlist: {
					title: "",
					songs: props.selectedSongs
				}
			};
		}

		// To update playlist with selected songs
		if (
			Boolean(props.editedPlaylist.id) &&
			props.isEditing &&
			state.isEditing !== true
		) {
			const playListSongsArray =
				props.editedPlaylist.songs === undefined
					? []
					: props.editedPlaylist.songs;

			const songs = [...playListSongsArray].concat(props.selectedSongs);
			const unique = songs
				.map(e => e["id"])
				.map((e, i, final) => final.indexOf(e) === i && i)
				.filter(e => songs[e])
				.map(e => songs[e]);
			return {
				...state,
				playlist: {
					...props.editedPlaylist,
					songs: unique
				},
				isEditing: true
			};
		}

		return null;
	}

	handleChange = e => {
		this.setState({
			...this.state,
			playlist: {
				...this.state.playlist,
				title: e.target.value
			}
		});
	};

	handleFormSubmit = e => {
		e.preventDefault();
		const {
			error,
			playlist,
			playlist: { title, songs }
		} = this.state;

		const required = Object.keys(playlist).filter(key => key !== "id");
		const emptyValues = required.filter(
			key => playlist[key] === "" || playlist[key].length === 0
		);
		console.log(emptyValues);

		// const errorState = {
		// 	title: title === "",
		// 	songs: songs.length === 0
		// };

		// if (errorState.title && errorState.songs) {
		// 	this.setState({ isError: true, error: errorState });
		// } else if (errorState.title) {
		// 	this.setState({
		// 		isError: true,
		// 		error: {
		// 			...error,
		// 			title: errorState.title
		// 		}
		// 	});
		// } else if (errorState.songs) {
		// 	this.setState({
		// 		isError: true,
		// 		error: {
		// 			...error,
		// 			songs: errorState.songs
		// 		}
		// 	});
		// } else {
		if (this.state.playlist.id) {
			fetch(`${BASE_URL}/playlists/${this.state.playlist.id}.json`, {
				method: "PUT",
				body: JSON.stringify(this.state.playlist)
			})
				.then(() => alert("Playlist edited successfully"))
				.then(() => this.props.fetchData());
		} else {
			fetch(`${BASE_URL}/playlists.json`, {
				method: "POST",
				body: JSON.stringify(this.state.playlist)
			})
				.then(() => {
					alert("Added playlist successfully");
				})
				.catch(() => alert("Error has occurred"));
		}
	};

	handleClose = () => {
		const { handleClose } = this.props;
		this.setState({ open: false, isEditing: false, editedPlaylist: "" });

		handleClose();
	};

	onDragEnd = result => {
		const { destination, source, draggableId } = result;
		const { songs } = this.state.playlist;

		if (!destination) {
			return;
		}

		if (destination.index === source.index) {
			return;
		}

		const newSongsIds = Array.from(this.state.playlist.songs);
		newSongsIds.splice(source.index, 1);
		newSongsIds.splice(
			destination.index,
			0,
			songs.find(song => song.id === draggableId)
		);

		this.setState({
			playlist: {
				...this.state.playlist,
				songs: newSongsIds
			}
		});
	};

	handleRemovePlaylistSong = id => {
		const { songs } = this.state.playlist;
		const filteredArray = songs.filter(song => song.id !== id);
		this.setState({
			...this.state,
			playlist: {
				...this.state.playlist,
				songs: filteredArray
			}
		});
	};

	render() {
		const {
			isCreating,
			isEditing,
			playlist: { songs = [], title = "" }
		} = this.state;
		const { selectedSongs } = this.props;

		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<Modal open={isCreating || isEditing} disableBackdropClick={true}>
					<ContainerModal>
						<WrapperInModal>
							<FormWrapper>
								<form
									onSubmit={this.handleFormSubmit}
									style={{ marginTop: "70px" }}
								>
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
									<SongsContainer
										songs={songs}
										selectedSongs={selectedSongs}
										removeSong={this.handleRemovePlaylistSong}
									/>
									{isEditing && (
										<InfoSnackBar message="Jesli chcesz dodać utwory, wróć do listy piosenek, zaznacz utwory i wróć tutaj ponownie. Wybrane piosenki pojawią się na dole listy. Pamiętaj, że nie pojawi się piosenka, która już znajduje się na liście. " />
									)}
									<Button type="submit">Zatwierdź</Button>
									<Button onClick={this.handleClose}>Wyjdź</Button>
								</form>
							</FormWrapper>
						</WrapperInModal>
					</ContainerModal>
				</Modal>
			</DragDropContext>
		);
	}
}

export default ModalCreatePlaylist;