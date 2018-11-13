import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { runInThisContext } from 'vm';

const axios = require('axios');

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSearch: '',
            suggestions: [],
            forecast: [],
            currentCity: '',
            typingTimer: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.doneTyping = this.doneTyping.bind(this);
        this.handleTyping = this.handleTyping.bind(this);
    }

    handleBlur() {
        $('.dropdown-toggle').dropdown('hide');
    }

    doneTyping() {
        axios.get('/api/suggest/' + this.state.currentSearch).then((response) => {
            this.setState({
                suggestions: response.data.predictions,
            });
        });
        $('.dropdown-toggle').dropdown('toggle');
    }

    handleChange(event) {
        this.setState({currentSearch: event.target.value});

        if(this.state.currentSearch !== '') {
            clearTimeout(this.state.typingTimer);
            this.setState({typingTimer: setTimeout(this.doneTyping, 1000)});
        }
    }

    handleTyping() {
        clearTimeout(this.state.typingTimer);
    }

    handleClick(event) {
        let placeId = event.target.id;
        this.setState({currentCity: event.target.innerHTML, currentSearch: event.target.innerHTML});

        axios.get('/api/location/' + placeId).then((response) => {
            let lat = response.data.result.geometry.location.lat;
            let lng = response.data.result.geometry.location.lng;

            axios.get('/api/forecast/' + lat + '/' + lng).then((response) => {
                this.setState({forecast: response.data.currently});
                $('.dropdown-toggle').dropdown('hide');
            });
        });
    }

    render() {
        const suggestions = this.state.suggestions.map((suggestion) => (
            <a className="dropdown-item" id={suggestion.place_id} href="#" onClick={this.handleClick}>{ suggestion.description }</a>
        ));

        let card;

        if(this.state.forecast.summary) {
            card = (
                <div className="row justify-content-center mb-5">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">{ this.state.currentCity }</h5>
                        </div>
                        <div className="card-body">
                            <p style={{fontSize: '0.3em'}}>{ this.state.forecast.summary }</p>
                            <p style={{fontSize: '0.3em'}}>{ this.state.forecast.temperature }</p>
                            <p style={{fontSize: '0.3em'}}>{ this.state.forecast.humidity }</p>
                        </div>  
                    </div>
                </div>
            );
        }

        return (
            <div className="container">
                <div className="row justify-content-center">
                    <h5>
                        Due to google policy as of the writting of this text(13th November 2018) regarding account with no billing information. 
                        This application could only display the weather info for one city because google limit Place API to one request per day :(.
                    </h5>
                </div>
                {card}
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        {/* <form onSubmit={this.handleSubmit}> */}
                            <input value={this.state.currentSearch} onChange={this.handleChange} onKeyUp={this.handleChange} onKeyDown={this.handleTyping} onBlur={this.handleBlur} type="text" className="form-control dropdown-toggle" id="dropdownMenuLink" aria-haspopup="true" aria-expanded="alse" name="location" placeholder="Enter a city or place..." autoComplete="off" />
                        {/* </form> */}
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            { suggestions }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}
