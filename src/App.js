import React, {Component} from 'react';
import Stickies from './components/Stickies';
import {TYPE_ONCE, TYPE_REMAINS, TYPE_REPEAT} from "./utils/constants";
import {EditorState} from "draft-js";
import {guid} from "./utils/utils";

const today = require('./data/today');
const remains = require('./data/remains');
const repeat = require('./data/repeat');
const once = require('./data/once');

export default class extends Component
{

	static defaultProps = {};

	constructor(props)
	{
		const notes = remains.default.concat(repeat.default).concat(once.default);
		/*const today = shuffle(notes).slice(0, 3);
		today.forEach((note, idx) =>
		{
			today[idx].state = 'today';
			today[idx].grid.w = 2;
			today[idx].grid.h = 2;
		});*/
		super(props);

		this.state = {
			addNote: false,
			currentNote: null,
			curtain: false,
			notes: notes,
			remains: remains.default,
			repeat: repeat.default,
			once: once.default,
			today: today.default,
		};

		// Bind all methods
		this.onDelete = this.onDelete.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onChangeType = this.onChangeType.bind(this);
		this.hideCurtain = this.hideCurtain.bind(this);
		this.showNote = this.showNote.bind(this);
		this.addNote = this.addNote.bind(this);
		this.createNote = this.createNote.bind(this);
	}

	onChange(notes)
	{
		this.setState({
			output: JSON.stringify(notes, null, 2), notes
		});
	}

	onChangeType(currentNote)
	{
		this.onDelete(currentNote);
		currentNote.contentEditable = false;
		currentNote.showSettings = false;
		if (currentNote.type === TYPE_REMAINS)
		{
			this.setState({
				remains: this.state.remains.concat(currentNote),
			});
		} else if (currentNote.type === TYPE_REPEAT)
		{
			this.setState({
				repeat: this.state.repeat.concat(currentNote),
			});
		} else if (currentNote.type === TYPE_ONCE)
		{
			this.setState({
				once: this.state.once.concat(currentNote),
			});
		}
	}

	onDelete(currentNote)
	{
		const today = this.state.today;
		const remains = this.state.remains;
		const repeat = this.state.repeat;
		const once = this.state.once;
		today.forEach((note, index) =>
		{
			if (currentNote.id === note.id) today.splice(index, 1);
		});
		remains.forEach((note, index) =>
		{
			if (currentNote.id === note.id) remains.splice(index, 1);
		});
		repeat.forEach((note, index) =>
		{
			if (currentNote.id === note.id) repeat.splice(index, 1);
		});
		once.forEach((note, index) =>
		{
			if (currentNote.id === note.id) once.splice(index, 1);
		});
		this.setState({
			today: today, remains: remains, repeat: repeat, once: once, curtain: false, currentNote: null
		});
	}

	hideCurtain(e)
	{
		e.stopPropagation();
		this.setState({
			curtain: false, addNote: false
		});
		if (this.state.currentNote !== null)
		{
			this.state.currentNote.contentEditable = false;
			this.state.currentNote.showSettings = false;
			this.setState({
				currentNote: null
			});
		}
	}

	showNote(e, currentNote)
	{
		e.stopPropagation();
		if (!currentNote.contentEditable)
		{
			currentNote.contentEditable = true;
			this.setState({
				currentNote: currentNote, curtain: true
			});
		}
	}

	addNote(e)
	{
		e.stopPropagation();
		this.setState({
			addNote: true, curtain: true
		});
	}

	createNote(e, type)
	{
		e.stopPropagation();
		const uid = guid();
		const note = {
			grid: {
				i: `${uid}`,
				x: this.state.notes.length * 2 % (this.state.cols || 12),
				y: Infinity, // puts it at the bottom
				w: 1, h: 1
			},
			id: uid,
			editorState: EditorState.createEmpty(),
			title: 'Title',
			type: type,
			contentEditable: true,
			showSettings: false
		};
		if (type === TYPE_REMAINS)
		{
			this.setState({
				remains: this.state.remains.concat(note),
				currentNote: note
			});
		} else if (type === TYPE_REPEAT)
		{
			this.setState({
				repeat: this.state.repeat.concat(note),
				currentNote: note
			});
		} else if (type === TYPE_ONCE)
		{
			this.setState({
				once: this.state.once.concat(note),
				currentNote: note
			});
		}
	}

	render()
	{
		let wrapperStyle = {
			height: '46vh', width: '100%', overflow: 'auto'
		};
		return (<div className="container-fluid">
			<div className="row">
				<div className="col-md-10 mb-5 p-4 bg-secondary text-left today">
					<h1 className="mb-0 text-uppercase">Today</h1>
					<Stickies
						notes={this.state.today}
						style={{float: 'left'}}
						title={true}
						footer={true}
						showNote={this.showNote}
						onChange={this.onChange}
						onChangeType={this.onChangeType}
						onDelete={this.onDelete}
						wrapperStyle={wrapperStyle}
					/>
				</div>
				<div className="col-md-2 btn-add-container">
					<button type="button"
							className="btn btn-success btn-add"
							onClick={(e) => this.addNote(e)}>
						<i className="fas fa-plus"/>
					</button>
				</div>
			</div>
			<div className="row">
				<div id="stickies-remains" className="p-0 pl-2 col-md-4">
					<h2 className="h4 text-uppercase remains">Remains</h2>
					<Stickies
						notes={this.state.remains}
						style={{float: 'left'}}
						title={true}
						footer={false}
						showNote={this.showNote}
						onChange={this.onChange}
						onChangeType={this.onChangeType}
						onDelete={this.onDelete}
						wrapperStyle={wrapperStyle}
					/>
				</div>

				<div id="stickies-repeat" className="p-0 col-md-4">
					<h2 className="h4 text-uppercase repeat">Repeat</h2>
					<Stickies
						notes={this.state.repeat}
						style={{float: 'left'}}
						title={true}
						footer={false}
						showNote={this.showNote}
						onChange={this.onChange}
						onChangeType={this.onChangeType}
						onDelete={this.onDelete}
						wrapperStyle={wrapperStyle}
					/>
				</div>

				<div id="stickies-once" className="p-0 pr-2 col-md-4">
					<h2 className="h4 text-uppercase once">Once</h2>
					<Stickies
						notes={this.state.once}
						style={{float: 'left'}}
						title={true}
						footer={false}
						showNote={this.showNote}
						onChange={this.onChange}
						onChangeType={this.onChangeType}
						onDelete={this.onDelete}
						wrapperStyle={wrapperStyle}
					/>
				</div>
			</div>
			{this.state.curtain ? <div className="curtain" onClick={(e) => this.hideCurtain(e)}>
				{this.state.currentNote ? <Stickies
					notes={[this.state.currentNote]}
					style={{float: 'left'}}
					title={true}
					footer={true}
					showNote={this.showNote}
					onChange={this.onChange}
					onChangeType={this.onChangeType}
					onDelete={this.onDelete}
					wrapperStyle={{
						height: '100vh', width: '100%', overflow: 'auto'
					}}
				/> : null}
				{this.state.addNote ? <div>
					<h2>New post-it</h2>
					<button className="btn btn-remains"
							onClick={(e) => this.createNote(e, TYPE_REMAINS)}>Remains
					</button>
					<button className="btn btn-repeat"
							onClick={(e) => this.createNote(e, TYPE_REPEAT)}>Repeat
					</button>
					<button className="btn btn-once"
							onClick={(e) => this.createNote(e, TYPE_ONCE)}>Once
					</button>
				</div> : null}
			</div> : null}
		</div>);
	}
}
