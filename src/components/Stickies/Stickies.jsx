import React, {Component} from 'react';
import {ContentState, Editor, EditorState} from 'draft-js';
import moment from 'moment';
import ContentEditable from './ContentEditable';
import './styles.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faExclamation} from '@fortawesome/free-solid-svg-icons'
import {STATE_TODAY, TYPE_ONCE, TYPE_REMAINS, TYPE_REPEAT} from "../../utils/constants";

const WidthProvider = require('react-grid-layout').WidthProvider;
let ResponsiveReactGridLayout = require('react-grid-layout').Responsive;

ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

/**
 * @method: tranformEditorState
 * @desc: Tranforms the text to editor state
 **/
function tranformEditorState(notes)
{
	const notesData = notes.default || notes;
	const data = notesData.map((note) =>
	{
		const text = note.default ? note.default.text : note.text || '';
		note.editorState = note.editorState || EditorState.createWithContent(ContentState.createFromText(text));
		return note;
	});
	return data;
}

/**
 * @method: transformContentState
 * @desc: Tranforms editor state to text content
 **/
function transformContentState(notes)
{
	const clonedNotes = Object.assign([], notes);
	const data = clonedNotes.map((note) =>
	{
		note.text = note.editorState.getCurrentContent().getPlainText();
		return note;
	});
	return data;
}

export default class extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			newCounter: 0,
			notes: props.notes ? tranformEditorState(props.notes) : [],
			colors: props.colors || ['#c0392b', '#2980b9', '#f1c40f'],
			dateFormat: props.dateFormat || 'lll'
		};
		this.renderNote = this.renderNote.bind(this);
		this.showNote = this.showNote.bind(this);
		this.editNote = this.editNote.bind(this);
		this.onLayoutChange = this.onLayoutChange.bind(this);
		this.onBreakpointChange = this.onBreakpointChange.bind(this);
	}

	componentWillReceiveProps(nextProps)
	{
		if (nextProps.notes && nextProps.notes.length)
		{
			this.setState({
				notes: tranformEditorState(nextProps.notes)
			});
		}
		this.setState({
			colors: nextProps.colors || ['#c0392b', '#2980b9', '#f1c40f'], dateFormat: nextProps.dateFormat || 'lll'
		});
	}

	handleTitleChange(html, currentNote)
	{
		const notes = this.state.notes;
		notes.forEach((note) =>
		{
			if (currentNote.id === note.id)
			{
				note.title = html.target.value;
			}
		});
		this.setState({
			notes
		}, () =>
		{
			if (this.props.onTitleChange)
			{
				this.props.onTitleChange(html, currentNote);
			}
		});
	}

	onChange(editorState, currentNote)
	{
		const notes = this.state.notes;
		const dateFormat = this.state.dateFormat;
		notes.forEach((note) =>
		{
			if (currentNote.id === note.id)
			{
				note.editorState = editorState;
				note.timeStamp = moment().format(dateFormat);
			}
		});
		if (typeof this.props.onChange === 'function')
		{
			this.props.onChange(transformContentState(this.state.notes), 'update');
		}
	}

	showNote(e, currentNote)
	{
		e.stopPropagation();
		// Show curtain and note
		this.props.showNote(e, currentNote);
	}

	editNote(e, currentNote)
	{
		e.stopPropagation();
		console.log('editNote');
		// TODO
	}

	deleteNote(currentNote)
	{
		const notes = this.state.notes;
		notes.forEach((note, index) =>
		{
			if (currentNote.id === note.id)
			{
				notes.splice(index, 1);
			}
		});
		this.setState({
			notes
		}, () =>
		{
			if (typeof this.props.onChange === 'function')
			{
				this.props.onChange(this.state.notes, 'delete');
				if (typeof this.props.onDelete === 'function')
				{
					this.props.onDelete(currentNote);
				}
			}
		});
	}

	onLayoutChange(layout)
	{
		const notes = this.state.notes;
		notes.forEach((note) =>
		{
			layout.forEach((grid) =>
			{
				if (grid.i === note.id)
				{
					note.grid = grid;
				}
			});
		});
		this.setState({
			notes
		}, () =>
		{
			if (typeof this.props.onChange === 'function')
			{
				this.props.onChange(this.state.notes, 'layout');
				if (typeof this.props.onLayoutChange === 'function')
				{
					this.props.onLayoutChange(layout);
				}
			}
		});
	}

	onBreakpointChange(breakpoint, cols)
	{
		this.setState({
			breakpoint, cols
		});
	}

	renderNote(note)
	{

		const addIcon = this.props.addIcon || '';
		const addStyle = this.props.addStyle || {};

		const closeIcon = this.props.closeIcon || '';
		const closeStyle = Object.assign({}, {
			display: (this.state.notes.length === 1) ? 'none' : 'block'
		}, this.props.closeStyle || {});

		const editIcon = this.props.editIcon || '';
		const editStyle = this.props.addStyle || {};

		note.contentEditable = false;

		if (note.type === TYPE_REMAINS) note.color = '#c0392b';
		if (note.type === TYPE_REPEAT) note.color = '#2980b9';
		if (note.type === TYPE_ONCE) note.color = '#f1c40f';

		const noteStyle = Object.assign({}, {
			background: note.color, transform: note.degree
		}, this.props.noteStyle || {});

		const noteHeaderStyle = Object.assign({}, {
			display: this.props.header === false ? 'none' : 'block'
		}, this.props.noteHeaderStyle || {});

		const noteBodyStyle = this.props.noteBodyStyle || {};

		const noteTitleStyle = Object.assign({}, {
			display: this.props.title === false ? 'none' : 'block'
		}, this.props.noteTitleStyle || {});

		const noteFooterStyle = Object.assign({}, {
			display: this.props.footer === false ? 'none' : 'block'
		}, this.props.noteFooterStyle || {});

		const i = note.grid.add ? '+' : note.grid.i;
		const grid = note.grid;
		grid.y = grid.y || Infinity;
		return (<div key={i} data-grid={grid}>
			<aside
				className={`note-wrap note ${note.state === STATE_TODAY ? 'big' : ''}`}
				style={noteStyle}
				onClick={(e) => this.showNote(e, note)}
			>
				<div className="note-header" style={noteHeaderStyle}>
					{/*<div
					 className={`${addIcon ? '' : 'add'}`}
					 onClick={this.createBlankNote}
					 style={addStyle}
					 >
					 {addIcon}
					 </div>*/}
					{note.important ? <span className="important">
						<FontAwesomeIcon icon={faExclamation}/>
					</span> : null}
					<div className="title" style={noteTitleStyle}>
						{!note.contentEditable ? note.title : <ContentEditable
							html={note.title}
							onChange={html => this.handleTitleChange(html, note)}/>}
					</div>
					{/*<div
					 className={`${closeIcon ? '' : 'close'}`}
					 style={closeStyle}
					 onClick={() => this.deleteNote(note)}
					 >
					 {closeIcon}
					 </div>*/}
				</div>
				<div className="note-body" style={noteBodyStyle}>
					<Editor
						editorState={note.editorState}
						onChange={editorState => this.onChange(editorState, note)}
						placeholder="Add your notes..."
					/>
				</div>
				<div
					className="note-footer"
					style={noteFooterStyle}
				>
					<div
						className={`${editIcon ? '' : 'edit'}`}
						style={editStyle}
						onClick={(e) => this.editNote(e, note)}
					>
						<FontAwesomeIcon icon={faCog}/>
					</div>
					{/*{note.timeStamp}*/}
				</div>
			</aside>
		</div>);
	}

	render()
	{
		const gridProps = this.props.grid || {};
		const grid = {
			className: 'layout',
			cols: gridProps.cols || {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
			rowHeight: gridProps.rowHeight || 100,
			isDraggable: gridProps.isDraggable === undefined ? false : gridProps.isDraggable,
			isResizable: gridProps.isResizable === undefined ? false : gridProps.isResizable,
			useCSSTransforms: gridProps.useCSSTransforms === undefined ? true : gridProps.useCSSTransforms,
			margin: gridProps.margin
		};
		const wrapperStyle = this.props.wrapperStyle || {};
		return (<div className="react-stickies-wrapper clearfix" style={wrapperStyle}>
			<ResponsiveReactGridLayout
				onLayoutChange={this.onLayoutChange}
				onBreakpointChange={this.onBreakpointChange}
				{...grid}
			>
				{this.state.notes.map(this.renderNote)}
			</ResponsiveReactGridLayout>
		</div>);
	}
}
