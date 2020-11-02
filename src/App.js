import React, {Component} from 'react';
import Stickies from 'react-stickies';

const today = require('./components/today');
const remains = require('./components/remains');
const repeat = require('./components/repeat');
const once = require('./components/once');

export default class extends Component
{

	static defaultProps = {};

	constructor(props)
	{
		super(props);
		this.state = {
			today: today.default,
			remains: remains.default,
			repeat: repeat.default,
			once: once.default,
		};
		this.onChange = this.onChange.bind(this);
	}

	onChange(notes)
	{
		this.setState({
			output: JSON.stringify(notes, null, 2), notes
		});
	}

	render()
	{
		let wrapperStyle = {
			height: '50vh', width: '100%', overflow: 'auto'
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
						tape={false}
						onChange={this.onChange}
						wrapperStyle={wrapperStyle}
					/>
				</div>
				<div className="col-md-2">
					<button type="button" className="btn btn-success btn-add"><i className="fas fa-plus"></i></button>
				</div>
			</div>
			<div className="row">
				<div id="stickies-remains" className="p-0 pl-2 col-md-4">
					<h2 className="h4 text-uppercase remains">Remains</h2>
					<Stickies
						notes={this.state.remains}
						style={{float: 'left'}}
						title={true}
						footer={true}
						tape={false}
						onChange={this.onChange}
						wrapperStyle={wrapperStyle}
					/>
				</div>

				<div id="stickies-repeat" className="p-0 col-md-4">
					<h2 className="h4 text-uppercase repeat">Repeat</h2>
					<Stickies
						notes={this.state.repeat}
						style={{float: 'left'}}
						title={true}
						footer={true}
						tape={false}
						onChange={this.onChange}
						wrapperStyle={wrapperStyle}
					/>
				</div>

				<div id="stickies-once" className="p-0 pr-2 col-md-4">
					<h2 className="h4 text-uppercase once">Once</h2>
					<Stickies
						notes={this.state.once}
						style={{float: 'left'}}
						title={true}
						footer={true}
						tape={false}
						onChange={this.onChange}
						wrapperStyle={wrapperStyle}
					/>
				</div>
			</div>
		</div>);
	}
}
