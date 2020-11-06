import React, {Component} from 'react';
// import Stickies from 'react-stickies';
import Stickies from './components/Stickies';
import {TYPE_ONCE, TYPE_REMAINS, TYPE_REPEAT} from "./utils/constants";
import {EditorState} from "draft-js";
import moment from "moment";

const today = require('./data/today');
const remains = require('./data/remains');
const repeat = require('./data/repeat');
const once = require('./data/once');

export default class extends Component
{

	static defaultProps = {};

	constructor(props)
	{
		super(props);
		this.state = {
			addNote: false,
			currentNote: null,
			curtain: false,
			today: today.default,
			remains: remains.default,
			repeat: repeat.default,
			once: once.default,
		};
		this.onChange = this.onChange.bind(this);
		this.toggleCurtain = this.toggleCurtain.bind(this);
		this.addNote = this.addNote.bind(this);
		this.showNote = this.showNote.bind(this);
		this.createNote = this.createNote.bind(this);
	}

	onChange(notes)
	{
		this.setState({
			output: JSON.stringify(notes, null, 2), notes
		});
	}

	toggleCurtain(e)
	{
		e.stopPropagation();
		this.setState({
			curtain: false
		});
		if (this.state.currentNote !== null)
		{
			this.state.currentNote.contentEditable = false;
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
				i: `${uid}`, x: this.state.notes.length * 2 % (this.state.cols || 12), y: Infinity, // puts it at the bottom
				w: 1, h: 1
			}, id: uid, editorState: EditorState.createEmpty(), title: 'Title', type: type, contentEditable: false
		};
		if (type === TYPE_REMAINS)
		{
			this.setState({
				remains: this.state.remains.concat(note),
			});
		} else if (type === TYPE_REPEAT)
		{
			this.setState({
				repeat: this.state.repeat.concat(note),
			});
		} else if (type === TYPE_ONCE)
		{
			this.setState({
				once: this.state.once.concat(note),
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
						onChange={this.onChange}
						showNote={this.showNote}
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
						onChange={this.onChange}
						showNote={this.showNote}
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
						onChange={this.onChange}
						showNote={this.showNote}
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
						onChange={this.onChange}
						showNote={this.showNote}
						wrapperStyle={wrapperStyle}
					/>
				</div>
			</div>
			{this.state.curtain ? <div className="curtain" onClick={(e) => this.toggleCurtain(e)}>
				{this.state.currentNote ? <Stickies
					notes={[this.state.currentNote]}
					style={{float: 'left'}}
					title={true}
					footer={true}
					onChange={this.onChange}
					showNote={this.showNote}
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

/**
 * @method: guid
 * @desc: Generates unique guid
 **/
function guid()
{
	function s4()
	{
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
