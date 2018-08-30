import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function AmountInput(props) {
    return (
        <input type="text" value={props.amount} className={props.inputClassName} onChange={props.onChange}/>
    );
}

function CodeInput(props) {
    return (
		<select className={props.selectClassName} value={props.codeValue} onChange={props.onChange}>
            {props.optionValues}
		</select>
    );
}

class Converter extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            baseAmount: "1.00",
			baseCode: "USD",
			targetAmount: "0.00",
			targetCode: "NOK",
			exchangeRates: {}
        };
    }
	
	componentWillMount() {
		this.getExchangeRateDataFromAPI();
	}
	
	getExchangeRateDataFromAPI(baseCode, amount) {
		baseCode = baseCode || this.state.baseCode;
		amount = amount || '1.00';
		const apiURL = this.getAPIURL() + '?base=' + baseCode;
		const targetCode = this.state.targetCode;
		fetch(apiURL)
		.then((response) => response.json())
		.then((responseJson) => {			
			let rates = responseJson.rates;
			rates[baseCode] = 1.00;
			const sortedRateKeys = Object.keys(rates).sort();
			let sortedRates = {};
			for(let k = 0; k < sortedRateKeys.length; k++) {
				sortedRates[sortedRateKeys[k]] = rates[sortedRateKeys[k]];
			}

			this.setState({
				exchangeRates: sortedRates,
				targetAmount: sortedRates[targetCode],
				baseAmount: amount
			});
		})
		.catch((error) => {
			console.log('error!');
			console.log(error);
		});
	}
	
	getAPIURL() {
		return 'https://api.exchangeratesapi.io/latest';
	}

	handleAmountChange(e, isBase) {
		let convertedAmount;
		let baseKey;
		let convertedKey;
		if(isBase) {
			convertedAmount = this.convert(e.target.value);
			baseKey = 'baseAmount';
			convertedKey = 'targetAmount';
		}
		else {
			convertedAmount = this.reverseConvert(e.target.value);
			convertedKey = 'baseAmount';
			baseKey = 'targetAmount';
		}
		
		this.setState({
			[baseKey]: e.target.value,
			[convertedKey]: convertedAmount
		});
		
		
	}
	
	convert(amount, rate) {
		rate = rate || this.state.exchangeRates[this.state.targetCode];
		console.log(amount);
		console.log(rate);
		return (parseFloat(amount) * rate).toFixed(2);
	}
	
	reverseConvert(amount, rate) {
		rate = rate || this.state.exchangeRates[this.state.targetCode];
		return ( parseFloat(amount) / rate).toFixed(2);
	}

	handleCodeChange(e, isBase) {
		let convertedAmount;
		let codeKey;
		let amountKey;
		
		if(isBase) {
			this.getExchangeRateDataFromAPI(e.target.value, this.state.baseAmount);
			convertedAmount = this.convert(this.state.baseAmount, this.state.exchangeRates[this.state.targetCode]);
			codeKey = 'baseCode';
			amountKey = 'targetAmount';
		}
		else {
			// Get new exchange from new code (key in rates)
			convertedAmount = this.convert(this.state.baseAmount, this.state.exchangeRates[e.target.value]);
			codeKey = 'targetCode';
			amountKey = 'targetAmount';
		}
		
		this.setState({
			[codeKey]: e.target.value,
			[amountKey]: convertedAmount
		});
	}

	renderAmount(isBase) {
		const amount = (isBase) ? this.state.baseAmount : this.state.targetAmount;
		const className = (isBase) ? "base-amount amount-input" : "target-amount amount-input";
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
		const className = (isBase) ? "base-code code-input" : "target-code code-input";
		
		const rates = this.state.exchangeRates;
		
		
		let options = [];
		
		for(let r in rates) {
			options.push(<option value={r}>{r}</option>);
		}
		
		return (
			<CodeInput
				codeValue={code}
				selectClassName={className}
				onChange={e => this.handleCodeChange(e, isBase)}
				optionValues={options}
			/>
		);
	}
	
	renderRates() {
			
	}
    render() {
        return (
			<div className="conversion-tool-content">
				<div className="conversion-tool">
					<div className="conversion-tool-header"><h2>React Currency Conversion Tool</h2></div>
					<div className="conversion-description">
						<div className="conversion-description-base">
							{parseFloat(this.state.baseAmount).toFixed(2)} {this.state.baseCode}
						</div>
						<div className="conversion-description-target">
							{parseFloat(this.state.targetAmount).toFixed(2)} {this.state.targetCode}
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
					<div>
						{this.renderRates()}
					</div>
				</div>
			</div>
        );
    }
}


ReactDOM.render(<Converter />, document.getElementById("root"));
