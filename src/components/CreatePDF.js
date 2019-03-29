import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class CreatePDF extends Component {
	state = {
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

	createPDF = () => {
		const song = this.state.songs[0];

		const text = song.description;

		const chords = song.description
			.split("\n")
			.map(verse =>
				verse.split("<")[1]
					? verse
							.split("<")[1]
							.trim()
							.slice(0, -1)
							.split(", ")
							.join(" ")
					: ""
			)
			.join("\n");

		var dd = {
			content: [
				{
					text: song.title,
					style: "header"
				},
				{
					columns: [
						{
							width: "75%",
							text: song.description
						},
						{
							width: "20%",
							text: chords
						}
					]
				}
			],
			styles: {
				header: {
					fontSize: 18,
					bold: true
				}
			}
		};
		pdfMake.createPdf(dd).open();
	};

	render() {
		return (
			<Button
				variant="outlined"
				style={{ height: "40px" }}
				onClick={this.createPDF}
			>
				Create PDF
			</Button>
		);
	}
}

export default CreatePDF;