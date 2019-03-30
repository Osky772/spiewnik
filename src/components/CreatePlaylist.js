import React, { Component, Fragment } from "react";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import {
	WrapperInModal,
	FormWrapper,
	SongsListRow
} from "./containers/StyledContainers";

class CreatePlaylist extends Component {
	state = {
		open: false,
		songs: []
	};

	static getDerivedStateFromProps(props, state) {
		if (props.selectedSongs.length !== state.songs.length) {
			return {
				songs: props.selectedSongs
			};
		}
		return null;
	}

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	render() {
		const { songs } = this.state;

		return (
			<Fragment>
				<Button
					variant="outlined"
					style={{ height: "40px" }}
					onClick={this.handleOpen}
				>
					DODAJ PLAYLISTĘ
				</Button>
				<Modal open={this.state.open} disableBackdropClick={true}>
					<WrapperInModal>
						<FormWrapper>
							<form>
								<TextField
									id="outlined-full-width"
									label="Nazwa"
									name="nazwa"
									// style={styles.textField}
									// onChange={this.handleChange}
									// value={this.state.song.title}
									autoComplete="off"
									placeholder="Podaj nazwę dla playlisty"
									margin="normal"
									fullWidth
									variant="outlined"
									InputLabelProps={{
										shrink: true
									}}
								/>
								<Typography variant="h5" style={{ margin: "10px 0 25px 0" }}>
									Wybrane piosenki
								</Typography>
								{songs.map(({ id, performer, title }, nr) => (
									<SongsListRow key={id} elevation={1}>
										<Typography variant="h5" style={{ marginRight: 15 }}>
											{nr + 1}.
										</Typography>
										<div>
											<Typography variant="h5">
												{performer ? performer + " - " + title : title}
											</Typography>
										</div>
									</SongsListRow>
								))}
								<Button type="submit">Zatwierdź</Button>
								<Button onClick={this.handleClose}>Wyjdź</Button>
							</form>
						</FormWrapper>
					</WrapperInModal>
				</Modal>
			</Fragment>
		);
	}
}

export default CreatePlaylist;
