import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function AmountInput(props) {
    return (
        <input type="text" defaultValue={props.amount} className={props.inputClassName} onChange={props.onChange}/>
    );
}

function CodeInput(props) {
    return (
		<select defaultValue={props.codeValue} onChange={props.onChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
		</select>
    );
}

class Converter extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            baseAmount: "1.00",
			baseCode: "USD",
			targetAmount: "8.77",
			targetCode: "NOK"
        };
    }
	
	handleAmountChange() {
		console.log(this.state.baseAmount);
	}
	
	handleCodeChange() {
		console.log(this.state.baseCode);
	}
	
	renderAmount(isBase) {
		const amount = (isBase) ? this.state.baseAmount : this.state.targetAmount;
		const className = (isBase) ? "base-amount" : "target-amount";
		return (
			<AmountInput
				amount={amount}
				inputClassName={className}
				onChange={() => this.handleAmountChange()}
			/>
		);
	}
	
	renderCode(isBase) {
		const code = (isBase) ? this.state.baseCode : this.state.targetCode;
		const className = (isBase) ? "base-code" : "target-code";
		return (
			<CodeInput
				codeValue={code}
				selectClassName={className}
				onChange={() => this.handleCodeChange()}
			/>
		);
	}
	
    render() {
        return (
			<div>
				<div className="base-inputs">
					{this.renderAmount(true)}
					{this.renderCode(true)}	
				</div>
				<div className="target-inputs">
					{this.renderAmount(false)}
					{this.renderCode(false)}
				</div>
			</div>
        );
    }  
}


ReactDOM.render(<Converter />, document.getElementById("root"));