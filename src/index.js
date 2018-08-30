import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Converter extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            title: 'My React Currency Converter'
        };
    }
	
    render() {
        return (
          <div>
            {this.state.title}  
          </div>
        );
    }  
}


ReactDOM.render(<Converter />, document.getElementById("root"));