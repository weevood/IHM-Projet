import React, {Component} from 'react';
import Stickies from 'react-stickies';

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
			remains: remains.default, repeat: repeat.default, once: once.default,
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
				<div className="col-md-10 mb-4 bg-secondary text-left today">
					<h1 className="text-uppercase">Today</h1>
				</div>
				<div className="col-md-2">
					<button type="button" className="btn btn-success btn-add"><i className="fas fa-plus"></i></button>
				</div>
			</div>
			<div className="row">
				<div id="stickies-remains" className="col-md-4">
					<h2 className="remains text-uppercase">Remains</h2>
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

				<div id="stickies-repeat" className="col-md-4">
					<h2 className="repeat text-uppercase">Repeat</h2>
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

				<div id="stickies-once" className="col-md-4">
					<h2 className="once text-uppercase">Once</h2>
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
