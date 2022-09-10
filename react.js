const root = ReactDOM.createRoot(document.getElementById("root"));
// import env from "react-dotenv";

//Math
function getIntrinsicValue(
    freeCashFlow,
    growthRate,
    discountRate,
    years,
    freeCashFlowMultiple,
    numberOfShares,
    safetyMargin,
    ticker
) {
    // Every future cash flow for every period
    const FCF = [];
    function grow(number, growthRate) {
        let result;
        if (number >= 0) {
            result = (number * (1 + Number(growthRate))).toFixed(2)
        } else {
            result = (number * (1 + Number(growthRate))).toFixed(2)
        }

        FCF.push(result)

        return result
    }
    const firstYear = grow(freeCashFlow, growthRate)
    for (let index = 1; index < years; index++) {
        let highestIndex = -1
        FCF.forEach(element => {
            highestIndex++
        });
        grow(FCF[highestIndex], growthRate)
    }

    // Discounted cash flow for every period 
    const discountedFCF = [];

    function discount(number, discountRate) {
        let result;

        if (discountRate === -1) {
            result = 0
        } else {
            result = (number / ((1 + Number(discountRate)) ** years)).toFixed(2)
        }

        discountedFCF.push(result)
        return result
    }

    FCF.forEach(number => {
        discount(number, discountRate)
    })

    const discountedTerminalValue = Number(
        discountedFCF[years - 1] * freeCashFlowMultiple
    ).toFixed(2);

    let discountedSum = 0;
    for (let i = 1; i < discountedFCF.length; i++) {
        discountedSum += parseFloat(discountedFCF[i]);
    }

    const totalIntrinsicValue =
        parseFloat(discountedSum) + parseFloat(discountedTerminalValue);

    const valuePerShare = parseFloat(
        totalIntrinsicValue / numberOfShares
    ).toFixed(2);

    const safeValue = (valuePerShare / (1 + safetyMargin / 100)).toFixed(2)

    if (safeValue !== 'NaN') {
        document.getElementById('intrinsicValue').innerText = '$' + safeValue

        fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c9j6mfqad3iblk5amu0g`)
            .then(response => response.json())
            .then(data => {
                const currentPrice = data.c
                document.getElementById('price').innerText = `Price: $${currentPrice}`
                if (currentPrice > safeValue) {
                    document.getElementById('rated').style.color = '#e40000'
                    document.getElementById('rated').innerText = 'Overrated'
                } else {
                    document.getElementById('rated').style.color = 'green'
                    document.getElementById('rated').innerText = 'Underrated'
                }
            })
    } else {
        document.getElementById('intrinsicValue').innerText = '$0.00'
    }
}

function getGrowthRate(array) {
    const rates = []
    for (let i = 0; i < array.length - 1; i++) {
        let rate = (array[i] / array[i + 1]) - 1
        rates.push(rate)
    }
    // Average rate for every year
    const sum = rates.reduce((a, b) => a + b, 0)
    const averageRate = parseFloat(sum / (rates.length)).toFixed(2)
    return averageRate
}

// Page components
function EmptyBookmark(props) {
    return (
        <button className="bookmark-icon invisible-btn" onClick={props.function}>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-bookmark-plus" viewBox="0 0 16 16">
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z" />
            </svg>
        </button>
    )
}

function FullBookmark(props) {
    return (
        <button className="bookmark-icon invisible-btn" onClick={props.function}>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
            </svg>
        </button>
    )
}

function DoubleBookmark(props) {
    return (
        <div className="double-bookmark-div">
            <input type="checkbox" id="double-bookmark-cbox"></input>
            <label className="bookmark-icon invisible-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-bookmarks-fill" viewBox="0 0 16 16">
                    <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5V4z" />
                    <path d="M4.268 1A2 2 0 0 1 6 0h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L13 13.768V2a1 1 0 0 0-1-1H4.268z" />
                </svg>
            </label>
        </div >
    )
}

function DocumentationPage(props) {
    return (
        <div id="documentation-background" className="centered">
            <button id="close-documentation" className="invisible-btn" onClick={props.function}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                </svg>
            </button>
            <div id="documentation-page" className="page centered">

                <h2>Instructions</h2>
                <p>
                    In order to get a perfect evaluation of the company you are interest in, there are some simple passages to follow:
                </p>
                <ol>
                    <li>Insert the stock ticker, in capital letters, in the first search bar and then click on "Search"</li>
                    <li>Modify the parameters you want to change (e.g. "Safety margin" or "Discount rate"), if some</li>
                    <li>Click on "Calculate" button and wait for the calculation to be done</li>
                </ol>

                <h2><span style={{ color: '#e40000' }}> Overrated</span>/<span style={{ color: 'green' }}>underrated</span>?</h2>
                <p>
                    After the calculation have been done the system will get the current price of the stock and, if the intrinsic value is lower than the current price, then the stock is considered <u>underrated</u> by the market, so is reasonable to buy. <br></br>
                </p>

                <h2>
                    What the hell are those parameters?
                </h2>
                <p>
                    The parameters you see are data of the company you searched. Let's get a quick overview of the more technical ones:
                </p>
                <ul>
                    <li><strong>Free cashflow.</strong> This is the amount of cash left to the company last fiscal year.
                        It's calculated subtracting <u>capital expenditures</u> from <u>operating income</u>.</li>
                    <li><strong>Growth rate.</strong> This is the ratio at which is expected to grow tha company cashflow in the next 5 years.
                        It's calculated on the last five years.</li>
                    <li><strong>Discount rate.</strong> This is how much would you get from investing in another product.
                        Some of the most used references are <u>government bonds</u> or <u>gold price.</u></li>
                    <li><strong>Years to considerate.</strong> This is the number of years to consider to make a projection of the future value.</li>
                    <li><strong>Multiple.</strong> This parameter is the ratio between the past <u>market capitalization</u> and the <u>free cash flow</u></li>
                    <li><strong>Safety margin.</strong> There is no sure investment, so the safety margin lowers the intrinsic value for assuming that there could be a margin of error in the prediction.</li>
                </ul>

                <h2>Principles of valutation</h2>
                <p>
                    The concept behind al the math that is being made behind the scenes is quite simple:
                    if this company create a return X every year, is reasonable to spend Y for acquire that asset?
                    Those reasoning finds his ralization in getting a prediction of the future value of the company using the growth rate,
                    as if we buy it today and then, afer Z amount of years, sell it; everything discounted with the money that we could have made meanwhile,
                    investing in something else, plus a safety margin (in case something we couldn't predict happens).
                    <br></br>
                    This system is created for calculating the intrinsic value of shares without having to search the data in the financial reports of every single company, <i>this is NOT a qualified financial advice and you shouldn't subsitute that to your own reasoning.</i>
                </p>

                <hr></hr>

                <p id="credits">Produced by <strong>Natan Zucchetti</strong> <img id="logo" src="./logo-nz.png"></img></p>
            </div>
        </div >

    )
}

function DocumentationButton(props) {
    return (
        <div>
            < button className="btn" id="documentation-btn" onClick={props.function} > <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                className="bi bi-file-earmark-text" viewBox="0 0 16 16">
                <path
                    d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                <path
                    d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
            </svg></button >
        </div>
    )
}

// Pages
class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ticker: null,
            freeCashFlow: null,
            growthRate: null,
            discountRate: 0.15,
            years: 5,
            sharesOutstanding: null,
            marketCapitalization: null,
            multiple: null,
            safetyMargin: 10,
            showRate: false
        };
        this.search = this.search.bind(this);
        this.addToFavorites = this.addToFavorites.bind(this);
        this.getIValue = this.getIValue.bind(this);
    }

    search() {
        const ticker = document.getElementById('ticker').value
        // this.setState({
        //     ticker: ticker
        // })

        console.log("Getting data...");

        const financialData = fetch(
            `https://finnhub.io/api/v1/stock/financials-reported?symbol=${ticker}&token=c9j6mfqad3iblk5amu0g`
        ).then((res) => res.json());
        
        const overviewData = fetch(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=c9j6mfqad3iblk5amu0g`
        ).then((res) => res.json());
    
        const allData = Promise.all([financialData, overviewData]);
    
        allData.then((res) => {
                // Financial data
                const financialData = res[0]
                console.log("financial data: ", financialData);

                // Overview data
                const overviewData = res[1];
                console.log("overview data: ", overviewData);
                const sharesOutstanding = overviewData.shareOutstanding * 1000000
                const marketCap = overviewData.marketCapitalization * 1000000
                
                // Displays data
                if (res.financialStatus = '<Response [200] >') {
                    function findOperatingIncome(params) {
                        return params.concept === "NetCashProvidedByUsedInOperatingActivities"
                    }
                    function findCapEx(params) {
                        return params.concept === "PaymentsToAcquirePropertyPlantAndEquipment"
                    }

                    function findOperatingIncomeUsGaap(params) {
                        return params.concept === "us-gaap_NetCashProvidedByUsedInOperatingActivities"
                    }
                    function findCapExUsGaap(params) {
                        return params.concept === "us-gaap_PaymentsToAcquirePropertyPlantAndEquipment"
                    }

                    const cashFlowStatement = financialData.data[0].report.cf

                    let operatingIncome = cashFlowStatement.find(findOperatingIncome)
                    let capExpenditures = cashFlowStatement.find(findCapEx)

                    if (!operatingIncome && !capExpenditures) {
                        operatingIncome = cashFlowStatement.find(findOperatingIncomeUsGaap)
                        capExpenditures = cashFlowStatement.find(findCapExUsGaap)
                    }

                        const freeCashFlow = operatingIncome.value - capExpenditures.value

                        const multiple = Number(marketCap / freeCashFlow).toFixed(2)
                        const flows = []
                        let years;
                        if (financialData.data.length < this.state.years) {
                            years = financialData.data.length
                        } else {
                            years = this.state.years
                        }

                        for (let i = 0; i < years; i++) {
                            const cashFlowStatement = financialData.data[i].report.cf
                            const operatingIncome = cashFlowStatement.find(findOperatingIncome)
                            const capExpenditures = cashFlowStatement.find(findCapEx)
                            if (operatingIncome && capExpenditures) {
                                const freeCashFlow = operatingIncome.value - capExpenditures.value
                                flows.push(freeCashFlow)
                            }
                        }
                        const growthRate = getGrowthRate(flows)
                        
                        document.getElementById(`freeCashFlow`).value = freeCashFlow;
                        document.getElementById(`sharesOutstanding`).value = sharesOutstanding;
                        document.getElementById(`marketCapitalization`).value = marketCap;
                        document.getElementById(`multiple`).value = multiple;
                        document.getElementById(`growthRate`).value = growthRate;
                        
                        console.log("Setting state...");
                        this.setState({
                            freeCashFlow: freeCashFlow,
                            sharesOutstanding: sharesOutstanding,
                            marketCapitalization: marketCap,
                            multiple: multiple,
                            growthRate: growthRate
                        })
                        
                } else {
                    console.log("Fuck that");
                    this.setState({
                        ticker: ticker,
                        freeCashFlow: null,
                        sharesOutstanding: sharesOutstanding,
                        marketCapitalization: marketCap,
                        multiple: null,
                        growthRate: null
                    })
                }

                document.getElementById('intrinsicValue').innerText = '$0.00'

            });

    }

    componentDidMount() {
        const canLogout = document.getElementById('logoutBtn')
        if (canLogout) {
            this.setState({
                isLoggedIn: true
            })
        }
    }

    componentDidUpdate() {

        const fields = ['freeCashFlow', 'growthRate', 'discountRate', 'years', 'multiple', 'marketCapitalization', 'sharesOutstanding', 'safetyMargin']
        fields.forEach(field => {
            let state = this.state[field]
            if (state) {
                document.getElementById(`${field}`).value = state
            } else {
                document.getElementById(`${field}`).value = ''
                console.log(`Missing ${field}`);
            }
        });

        const canLogout = document.getElementById('logoutBtn')
        const stock = document.getElementById('ticker').value
        const stockList = document.getElementById('favoritesList')

        if (canLogout && stockList && stock in stockList) {
            if (this.state.isLoggedIn) {
                this.setState({
                    isFavorite: true
                })
            } else {
                this.setState({
                    isFavorite: true,
                    isLoggedIn: true
                })
            }
        } else if (canLogout) {
            if (!this.state.isLoggedIn) {
                this.setState({
                    isLoggedIn: true
                })
            }

        }
    }

    getIValue() {

        const freeCashFlow = document.getElementById('freeCashFlow').value
        const growthRate = document.getElementById('growthRate').value
        const discountRate = document.getElementById('discountRate').value
        const years = document.getElementById('years').value
        const marketCapitalization = document.getElementById('marketCapitalization').value
        const multiple = Number(document.getElementById('multiple').value).toFixed(3)
        const sharesOutstanding = document.getElementById('sharesOutstanding').value
        const safetyMargin = document.getElementById('safetyMargin').value
        const ticker = this.state.ticker

        getIntrinsicValue(freeCashFlow, growthRate, discountRate, years, multiple, sharesOutstanding, safetyMargin, ticker)

        this.setState({
            showRate: true,
            freeCashFlow: freeCashFlow,
            growthRate: growthRate,
            discountRate: discountRate,
            years: years,
            sharesOutstanding: sharesOutstanding,
            marketCapitalization: marketCapitalization,
            multiple: multiple,
            safetyMargin: safetyMargin,
        })
    }

    // Cookies
    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    addToFavorites() {
        const ticker = document.getElementById('ticker')
        const csrftoken = this.getCookie('csrftoken');

        if (ticker) {
            if (ticker.value.length > 0) {
                fetch("http://127.0.0.1:8000/favorites", {
                    method: 'PUT',
                    mode: 'same-origin',
                    headers: {
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({
                        ticker: ticker.value
                    })
                })
                    .then(response => response.json())
                    .then(result => {
                        this.setState({
                            isFavorite: true
                        })
                    })
            }
        }
    }

    render() {
        let button;
        let rateDiv;

        if (this.state.isFavorite) {
            button = < FullBookmark />
        } else {
            button = < EmptyBookmark function={this.addToFavorites} />
        }

        if (this.state.showRate) {
            rateDiv = <div id="ratedDiv">
                <span id="rated" className="centered col-12"></span>
                <span id="price" className="centered col-12"></span>
            </div>
        }

        return (
            <div className="col-sm-8 col-xs-12">
                <div id="page" className="container-flex">

                    <div id="tickerInput" className="row">
                        <input type="text" id="ticker" maxLength="6" autoFocus={true} className="input centered" placeholder="Insert a ticker..."></input>
                        {this.state.isLoggedIn &&
                            <span id="add-favorites-btn">
                                {button}
                            </span>
                        }
                        <div id="search-btn-div" >
                            <button onClick={this.search} id="search-btn" className="btn centered">Search</button>
                        </div>
                        <hr></hr>

                    </div>

                    <div id="dataInput" className="centered row">
                        <div className="col-sm-6 splitted">
                            <div className="">
                                <label htmlFor="freeCashFlow">Free cashflow:</label><br></br>
                                <input type="number" id="freeCashFlow" className="input" placeholder=""></input>
                            </div>
                            <div className="">
                                <label htmlFor="growthRate" className="strong">Growth rate:</label><br></br>
                                <input type="number" id="growthRate" className="input" placeholder=""></input>
                            </div>
                            <div className="">
                                <label htmlFor="discountRate">Discount rate:</label><br></br>
                                <input type="number" id="discountRate" className="input" placeholder=""></input>
                            </div>
                            <div className="">
                                <label htmlFor="years">Years to considerate:</label><br></br>
                                <input type="number" id="years" className="input" placeholder=""></input>
                            </div>
                        </div>

                        <div className="col-sm-6 splitted">
                            <div className="">
                                <label htmlFor="marketCapitalization">Market capitalization:</label><br></br>
                                <input type="number" id="marketCapitalization" className="input" placeholder=""></input>
                            </div>
                            <div className="">
                                <label htmlFor="multiple" className="strong">Multiple:</label><br></br>
                                <input type="number" id="multiple" className="input" placeholder=""></input>
                            </div>
                            <div className="">
                                <label htmlFor="sharesOutstanding">Outstanding stocks:</label><br></br>
                                <input type="number" id="sharesOutstanding" className="input" placeholder=""></input>
                            </div>
                            <div className="">
                                <label htmlFor="safetyMargin" className="strong">Safety margin (in %):</label><br></br>
                                <input type="number" id="safetyMargin" className="input" placeholder=""></input>
                            </div>
                        </div>
                        <div id="calculate-btn-div">
                            <button id="calculate-btn" className="btn centered" onClick={this.getIValue}>Calculate</button>
                        </div>
                    </div>
                    <div id="result" className="row">
                        <div id="intrinsicValueDiv" className="centered col-12">
                            <span id="intrinsicValueText">
                                Intrinsic value is:
                            </span>
                            <br></br>
                            <p id="intrinsicValue">
                                $0.00
                            </p>
                        </div>

                        {rateDiv}

                    </div>
                </div>
            </div >
        );
    }
}

class Documentation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
        this.showDocumentation = this.showDocumentation.bind(this);
    }

    showDocumentation() {
        const show = this.state.show
        if (show) {
            this.setState({
                show: false
            })
        } else {
            this.setState({
                show: true
            })
        }
    }

    render() {
        const shoudlShowDocumentation = this.state.show
        return (
            <div id="documentation-div" className="row">
                {shoudlShowDocumentation ? <DocumentationPage function={this.showDocumentation} /> :
                    <DocumentationButton function={this.showDocumentation} />}
            </div >
        )
    }
}

class Favorites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            favorites: [],

        };
    }

    componentDidMount() {
        fetch('http://127.0.0.1:8000/favorites')
            .then(response => response.json())
            .then(data => {
                const stocks = [];
                if (data.stock_pk !== 'Null') {
                    for (let i = 0; i < data.stock_pk.length; i++) {
                        const obj = new Object()
                        obj.key = data.stock_pk[i]
                        obj.ticker = data.favorites[i]
                        stocks.push(obj)
                    }

                    this.setState({
                        favorites: stocks
                    })
                }
            }
            )
    }

    insertText(e) {
        document.getElementById('ticker').value = e.target.innerText
    }

    // Cookies
    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    removeFromFavorites(stock, e) {
        e.currentTarget.disabled = true;

        const csrftoken = this.getCookie('csrftoken');

        fetch("http://127.0.0.1:8000/remove/" + stock, {
            method: 'DELETE',
            mode: 'same-origin',
            headers: {
                'X-CSRFToken': csrftoken
            }
        })
            .then(response => response.json())
    }

    render() {
        const favoritesArray = this.state.favorites
        const stockList = favoritesArray.map((stock) =>
            <li key={stock.key} >
                <button onClick={this.insertText} className="insert-btn invisible-btn">{stock.ticker}</button>
                <button onClick={(e) => this.removeFromFavorites(stock.ticker, e)} className="remove-btn invisible-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                    </svg>
                </button>
            </li >
        );
        const userHasFavorites = this.state.favorites.length
        const noFavorites = <div><i>You don't have any favorite stock yet</i></div>

        return (
            < div className="col-sm-4 col-xs-12" id="favorites-div" >
                <input type="checkbox" id="double-bookmark-cbox"></input>
                <label htmlFor="double-bookmark-cbox" id="double-bookmark-icon" className=" invisible-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-bookmarks-fill" viewBox="0 0 16 16">
                        <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5V4z" />
                        <path d="M4.268 1A2 2 0 0 1 6 0h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L13 13.768V2a1 1 0 0 0-1-1H4.268z" />
                    </svg>
                </label>

                <div id="favoritesList-wrapper">
                    <label htmlFor="double-bookmark-cbox" id="close-icon" className="invisible-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                        </svg>
                    </label>
                    <ul id="favoritesList" className="favoriteStocksList centered" >
                        <li id="listTitle"><strong>Favorited Stocks:</strong></li>
                        {userHasFavorites ? stockList : noFavorites}
                    </ul>
                </div>
            </div >
        )
    }
}

function Page(props) {
    const isLoggedIn = document.getElementById('logoutBtn')
    return (
        <div id="content">
            <div className="row" id="body-div">
                {isLoggedIn ? <Favorites /> : ''}
                <Calculator />
            </div>
            <Documentation />
        </div>

    );
}

root.render(<Page />);