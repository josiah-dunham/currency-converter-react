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
			exchangeRates: {},
			apiCallSuccess: -1,
			apiCallErrorMessage: null,
			showTechincalErrorMessage: false,
			fixedDecimalPlaces: 5
        };
    }
	
	componentWillMount() {
		this.getExchangeRateDataFromAPI();
	}
	
	getExchangeRateDataFromAPI(baseCode, amount) {
		baseCode = baseCode || this.state.baseCode;
		amount = amount || '1.00';
		console.log('amount' + amount);
		const apiURL = this.getAPIURL() + '?base=' + baseCode;
		const targetCode = this.state.targetCode;
		fetch(apiURL)
		.then((response) => response.json())
		.then((responseJson) => {			
			let rates = responseJson.rates;
			rates[baseCode] = '1.00';
			const sortedRateKeys = Object.keys(rates).sort();
			let sortedRates = {};
			for(let k = 0; k < sortedRateKeys.length; k++) {
				sortedRates[sortedRateKeys[k]] = rates[sortedRateKeys[k]];
			}
			
			let convertedAmount = this.convert(this.state.baseAmount, sortedRates[targetCode]);
			
			this.setState({
				exchangeRates: sortedRates,
				targetAmount: convertedAmount,
				baseAmount: this.decimalFormat(amount),
				apiCallSuccess: 1
			});
		})
		.catch((error) => {
			this.setState({
				apiCallSuccess: 0,
				apiCallErrorMessage: (error).toString()
			});
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
	
	moneyFormat(num) {
		num = (num == '') ? 1 : num;
		num = parseFloat(num).toFixed(2);

		const num_split = num.split(".");

		let leftside = num_split[0];
		let rightside = num_split[1];

		let counter = 0;
		let formatted = "";
		for(let i = leftside.length-1; i >= 0; i--){
			if(counter % 3 == 0 && counter > 0) {
				formatted = "," + formatted;
			}
			formatted = leftside.charAt(i) + formatted;
			counter++;
		}

		return formatted + "." + rightside;

		//return parseFloat(num).toFixed(2);
	}
	
	decimalFormat(num) {
		return parseFloat(num).toFixed(this.state.fixedDecimalPlaces);
	}
	
	convert(amount, rate) {
		rate = rate || this.state.exchangeRates[this.state.targetCode];
		let converted = parseFloat(amount) * rate;
		return this.decimalFormat(converted);
	}
	
	reverseConvert(amount, rate) {
		rate = rate || this.state.exchangeRates[this.state.targetCode];
		let converted = parseFloat(amount) / rate;
		return this.decimalFormat(converted);
	}

	handleCodeChange(e, isBase) {
		let convertedAmount;
		let codeKey;
		let amountKey;
		
		if(isBase) {
			this.getExchangeRateDataFromAPI(e.target.value, this.state.baseAmount);
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
			[amountKey]: this.state.targetAmount
		});
	}
	
	toggleTechnicalMessage() {
		this.setState({
			showTechincalErrorMessage: !this.state.showTechincalErrorMessage
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
		const codeToDisable = (isBase) ? this.state.targetCode : this.state.baseCode;
		
		const className = (isBase) ? "base-code code-input" : "target-code code-input";
		
		const rates = this.state.exchangeRates;
		
		let options = [];
		let optionKey = 1;
		
		for(let r in rates) {
			let disabledProp = '';
			let disabledClass = 'code-options enabled';
			if(r === codeToDisable) {
				disabledProp = 'disabled';
				disabledClass = 'code-options disabled';
			}
			
			options.push(<option className={disabledClass} disabled={disabledProp} key={optionKey} value={r}>{r}</option>);
			optionKey++;
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
	
    render() {
		if(this.state.apiCallSuccess === 1) {
			return (
				<div className="conversion-tool-content">
					<div className="conversion-tool">
						<div className="conversion-tool-header"><h2>React Currency Conversion Tool</h2></div>
						<div className="conversion-description">
							<div className="conversion-description-base">
								{this.moneyFormat(this.state.baseAmount)} {this.state.baseCode}
							</div>
							<div className="conversion-description-target">
								{this.moneyFormat(this.state.targetAmount)} {this.state.targetCode}
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
				</div>
			);
		}
		else if(this.state.apiCallSuccess === 0) {
			let toggleSymbol = "+";
			let toggleText = " Show technical error";
			let errorMessageClassName = "api-data-error-msg hide-message";
			if(this.state.showTechincalErrorMessage) {
				toggleSymbol = "-";
				toggleText = "Hide technical error";
				errorMessageClassName = "api-data-error-msg show-message";
			}
			return (
				<div className="conversion-tool-content">
					<div className="conversion-tool">
						<div className="api-data-error">
							<h2>Error!</h2>
							We're sorry, but there was an error retrieving the Currency Conversion data. Please try again later.
							<div className="api-data-error-msg-toggle">
								<span onClick={() => this.toggleTechnicalMessage()}><span className="toggleSymbolText">[ <span className="toggleSymbol">{toggleSymbol}</span> ]</span> <span className="toggleText">{toggleText}</span></span>
							</div>
							<div className={errorMessageClassName}>
								{this.state.apiCallErrorMessage}
							</div>
						</div>
					</div>
				</div>
			);
		}
		else {
			return (
				<div className="conversion-tool-content">
					<div className="conversion-tool">
						<b>Loading...</b>
					</div>
				</div>
			);
		}
        
    }
}


ReactDOM.render(<Converter />, document.getElementById("root"));
