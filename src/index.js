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
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="NOK">NOK</option>
            <option value="EURO">EURO</option>
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

	handleAmountChange(e, isBase) {
		const keyName = (isBase) ? "baseAmount" : "targetAmount";
		
		this.setState({
			[keyName]: e.target.value
		});
	}

	handleCodeChange(e, isBase) {
		const keyName = (isBase) ? "baseCode" : "targetCode";
		
		this.setState({
			[keyName]: e.target.value
		});
	}

	renderAmount(isBase) {
		const amount = (isBase) ? this.state.baseAmount : this.state.targetAmount;
		const className = (isBase) ? "base-amount" : "target-amount";
		return (
			<AmountInput
				amount={amount}
				inputClassName={className}
				onChange={e => this.handleAmountChange(e, isBase)}
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
				onChange={e => this.handleCodeChange(e, isBase)}
			/>
		);
	}

    render() {
        return (
			<div className="conversion-tool">
				<div className="conversion-description">
					<div className="conversion-description-base">
						{this.state.baseAmount} {this.state.baseCode}
					</div>
					<div className="conversion-description-target">
						{this.state.targetAmount} {this.state.targetCode}
					</div>
				</div>
				<div className="user-inputs">
					<div className="base-inputs">
						{this.renderAmount(true)}
						{this.renderCode(true)}
					</div>
					<div className="target-inputs">
						{this.renderAmount(false)}
						{this.renderCode(false)}
					</div>
				</div>
			</div>
        );
    }
}


ReactDOM.render(<Converter />, document.getElementById("root"));
