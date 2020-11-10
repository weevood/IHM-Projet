import React, {Component} from 'react';
import {ContentState, convertFromHTML, Editor, EditorState} from 'draft-js';
import moment from 'moment';
import ContentEditable from './ContentEditable';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import htmlToDraft from 'html-to-draftjs';
import {faArrowAltCircleLeft, faCog, faExclamation, faExternalLinkSquareAlt} from '@fortawesome/free-solid-svg-icons'
import {COLOR_ONCE, COLOR_REMAINS, COLOR_REPEAT, TYPE_ONCE, TYPE_REMAINS, TYPE_REPEAT} from "../../utils/constants";
import './styles.css';
import {currentDate, currentDay, currentTime} from "../../utils/utils";

const COLORS = [COLOR_ONCE, COLOR_REMAINS, COLOR_REPEAT];

const NOW_DAY = currentDay();
const NOW_DATE = currentDate();
const NOW_TIME = currentTime();
console.log(NOW_DATE);
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
				if (text.includes('-'))
				{
						let textConverted = '';
						text.split('-').forEach((item, idx) =>
						{
								textConverted += '<div class="custom-control custom-checkbox mr-sm-2">';
								textConverted += '<input type="checkbox" class="custom-control-input" id="list-item-' + idx + '" checked="" />';
								textConverted += '<label class="custom-control-label" for="list-item-' + idx + '">' + item + '</label>' + '</div>';
						});
						const blocksFromHTML = htmlToDraft(textConverted);
						console.log(blocksFromHTML);
						const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
						note.editorState = note.editorState || EditorState.createWithContent(state);
				}
				else
				{
						note.editorState = note.editorState || EditorState.createWithContent(ContentState.createFromText(text));
				}
				note.isExtLink = (note.text && note.text.includes('http') === true);
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
						colors: props.colors || COLORS,
						dateFormat: props.dateFormat || 'lll',
						today: props.today === true
				};

				// Bind all methods
				this.renderNote = this.renderNote.bind(this);
				this.showNote = this.showNote.bind(this);
				this.editNote = this.editNote.bind(this);
				this.onLayoutChange = this.onLayoutChange.bind(this);
				this.onBreakpointChange = this.onBreakpointChange.bind(this);
				this.setType = this.setType.bind(this);
				this.setImportant = this.setImportant.bind(this);
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
						colors: nextProps.colors || COLORS, dateFormat: nextProps.dateFormat || 'lll'
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
				if (currentNote.isExtLink && !this.props.curtain)
				{ // Open note link
						window.open(currentNote.text, '_blank');
						const notes = this.state.notes;
						notes.forEach((note) =>
						{
								if (currentNote.id === note.id)
								{
										currentNote.contentEditable = true;
								}
						});
						this.setState({
								notes
						});
						// Rollback edition after 10 seconds
						setTimeout(() =>
						{
								notes.forEach((note) =>
								{
										if (currentNote.id === note.id)
										{
												currentNote.contentEditable = false;
										}
								});
								this.setState({
										notes
								});
						}, 10000);
				}
				else
				{ // Show curtain and note
						this.props.showNote(e, currentNote);
				}
		}

		editNote(e, currentNote)
		{
				e.stopPropagation();
				if (currentNote.isExtLink)
				{ // Show curtain and note
						currentNote.contentEditable = false;
						this.props.showNote(e, currentNote);
				}
				const notes = this.state.notes;
				notes.forEach((note) =>
				{
						if (currentNote.id === note.id)
						{
								currentNote.showSettings = !currentNote.showSettings;
						}
				});
				this.setState({
						notes
				});
		}

		setType(currentNote, type)
		{
				const notes = this.state.notes;
				notes.forEach((note) =>
				{
						if (currentNote.id === note.id)
						{
								currentNote.type = type;
						}
				});
				this.setState({
						notes
				}, () =>
				{
						if (typeof this.props.onChangeType === 'function')
						{
								this.props.onChangeType(currentNote);
						}
				});
		}

		setImportant(currentNote)
		{
				const notes = this.state.notes;
				notes.forEach((note) =>
				{
						if (currentNote.id === note.id)
						{
								currentNote.important = !currentNote.important;
						}
				});
				this.setState({
						notes
				});
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

		onInputChange(input, value, currentNote)
		{
				const notes = this.state.notes;
				notes.forEach((note) =>
				{
						if (currentNote.id === note.id)
						{
								switch (input)
								{
										case 'day':
												currentNote.day = value;
												break;
										case 'date':
												currentNote.date = value;
												break;
										case 'time':
												currentNote.time = value;
												break;
										default:
												break;
								}
						}
				});
				this.setState({
						notes
				});
		}

		renderNote(note)
		{

				note.grid.w = this.props.today ? 2 : 1;
				note.grid.h = this.props.today ? 2 : 1;
				note.contentEditable = note.contentEditable || false;
				note.showSettings = note.showSettings || false;

				note.day = note.day !== undefined  ? note.day : NOW_DAY;
				note.date = note.date || NOW_DATE;
				note.time = note.time || NOW_TIME;

				if (note.type === TYPE_REMAINS)
				{
						note.color = COLOR_REMAINS;
				}
				else if (note.type === TYPE_REPEAT)
				{
						note.color = COLOR_REPEAT;
				}
				else if (note.type === TYPE_ONCE)
				{
						note.color = COLOR_ONCE;
				}

				const noteStyle = Object.assign({}, {
						background: note.color, transform: note.degree
				}, this.props.noteStyle || {});

				const noteHeaderStyle = Object.assign({}, {
						display: this.props.header === false ? 'none' : 'block'
				}, this.props.noteHeaderStyle || {});

				const noteTitleStyle = Object.assign({}, {
						display: this.props.title === false ? 'none' : 'block'
				}, this.props.noteTitleStyle || {});

				const noteBodyStyle = this.props.noteBodyStyle || {};

				const noteFooterStyle = Object.assign({}, {
						display: note.contentEditable === false ? 'none' : 'block'
				}, this.props.noteFooterStyle || {});

				return (<div key={note.grid.add ? '+' : note.grid.i} data-grid={note.grid}>
						<aside
								className={`note-wrap ${note.type} ${this.props.today ? 'today' : ''} ${note.contentEditable === true ? 'currentNote' : ''}`}
								style={noteStyle}
								onClick={(e) => this.showNote(e, note)}
						>
								<div className="note-header" style={noteHeaderStyle}>
										{note.important ? <span className="important">
						<FontAwesomeIcon icon={faExclamation}/>
					</span> : null}
										<div className="title" style={noteTitleStyle}>
												{!note.contentEditable ? note.title : <ContentEditable
														html={note.title}
														onChange={html => this.handleTitleChange(html, note)}/>}
										</div>
										{note.isExtLink ? <span className="link">
						<FontAwesomeIcon icon={faExternalLinkSquareAlt}/>
					</span> : null}
								</div>
								<div className={`note-body ${note.showSettings ? 'settings' : ''} `} style={noteBodyStyle}>
										{note.showSettings ? <div className="text-center">
												<div className="my-4">
														<div className="custom-control custom-radio custom-control-inline">
																<input type="radio" id="remains" name="remains" className="custom-control-input"
																       checked={note.type === TYPE_REMAINS}
																       onChange={() => this.setType(note, TYPE_REMAINS)}/>
																<label className="custom-control-label text-uppercase"
																       htmlFor="remains">{TYPE_REMAINS}</label>
														</div>
														<div className="custom-control custom-radio custom-control-inline">
																<input type="radio" id="repeat" name="repeat" className="custom-control-input"
																       checked={note.type === TYPE_REPEAT}
																       onChange={() => this.setType(note, TYPE_REPEAT)}/>
																<label className="custom-control-label text-uppercase"
																       htmlFor="repeat">{TYPE_REPEAT}</label>
														</div>
														<div className="custom-control custom-radio custom-control-inline">
																<input type="radio" id="once" name="once" className="custom-control-input"
																       checked={note.type === TYPE_ONCE}
																       onChange={() => this.setType(note, TYPE_ONCE)}/>
																<label className="custom-control-label text-uppercase"
																       htmlFor="once">{TYPE_ONCE}</label>
														</div>
												</div>
												<div className="my-4">
														<div className="custom-control custom-checkbox mr-sm-2">
																<input type="checkbox" className="custom-control-input" id="important"
																       checked={note.important}
																       onChange={() => this.setImportant(note)}/>
																<label className="custom-control-label" htmlFor="important">Important</label>
														</div>
												</div>
												<div className="my-4">
														<button type="button" className="btn btn-outline-danger"
														        onClick={() => this.deleteNote(note)}>Supprimer
														</button>
												</div>
										</div> : <Editor
												editorState={note.editorState}
												onChange={editorState => this.onChange(editorState, note)}
												placeholder="Add your notes..."
										/>}
								</div>
								<div className="note-footer"
								     style={noteFooterStyle}>
										{note.type !== TYPE_REMAINS && note.contentEditable && !note.showSettings ?
												<div className="form-inline">
														<div className="form-group">
																<label htmlFor="date"
																       className="mx-2">{note.type === TYPE_ONCE ? 'Du on :' : 'Repeat every :'} </label>
																{note.type === TYPE_ONCE ?
																		<input type="date" className="form-control set-date" id="date"
																		       value={note.date}
																		       onChange={event => this.onInputChange('date', event.target.value, note)}/> :
																		<select className="form-control select-day" id="date"
																		        onChange={event => this.onInputChange('day', event.target.value, note)}>
																				<option value="1" selected={note.day === "1"}>Monday</option>
																				<option value="2" selected={note.day === "2"}>Tuesday</option>
																				<option value="3" selected={note.day === "3"}>Wednesday</option>
																				<option value="4" selected={note.day === "4"}>Thursday</option>
																				<option value="5" selected={note.day === "5"}>Friday</option>
																				<option value="6" selected={note.day === "6"}>Saturday</option>
																				<option value="7" selected={note.day === "7"}>Sunday</option>
																		</select>}
																<label htmlFor="hour" className="mx-2">at</label>
																<input type="time" className="form-control set-hour" id="hour"
																       value={note.time} onChange={event => this.onInputChange('time', event.target.value, note)}/>
														</div>
												</div> : null}
										{note.showSettings ? <div className="back" onClick={(e) => this.editNote(e, note)}>
												<FontAwesomeIcon icon={faArrowAltCircleLeft}/>
										</div> : <div className="edit" onClick={(e) => this.editNote(e, note)}>
												<FontAwesomeIcon icon={faCog}/>
										</div>}
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
