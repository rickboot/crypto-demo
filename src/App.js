
import React, { useState, useEffect } from 'react';
import axios from './api/coinGecko';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Table from './components/Table';


var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

var formatter_fixed_0 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0, 
});

const columns = [
  {
    Header: 'Top 100 Crypto',
    columns: [
      {
        Header: 'Rank',
        accessor: 'market_cap_rank',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Symbol',
        accessor: 'symbol',
      },
      {
        Header: 'Price',
        accessor: 'current_price',
        Cell: props => formatter.format(props.value)
      },
      {
        Header: '24h',
        accessor: 'price_change_percentage_24h',
        Cell: props => <span>{formatter.format(props.value)} %</span>
      },
      {
        Header: 'Market Cap',
        accessor: 'market_cap',
        Cell: props => formatter_fixed_0.format(props.value)
      },
      {
        Header: 'Volume',
        accessor: 'total_volume',
        Cell: props => formatter_fixed_0.format(props.value)
      },
      {
        Header: 'Last updated',
        accessor: 'last_updated',
        Cell: props => new Date(props.value).toLocaleString()
      },
      {
        Header: 'Since ATH',
        accessor: 'ath_days',
        Cell: props => <span>{props.value} days</span>
      },
      {
        Header: 'Market Share',
        accessor: 'market_share_top100',
        Cell: props => <span>{props.value} %</span>
      }
    ],
  }
];

function App() {
  const [data, setData] = useState([{}]);
  const [date, setDate] = useState(new Date().toLocaleString())

  const daysSinceATH = (priorDateStr, newerDateStr) => {
    const diff = new Date(priorDateStr).getTime() - new Date(newerDateStr).getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
  }

  const prepData = (apiData) => {
    const top100_total = apiData.reduce((sum, curr) => {
      return sum + curr.market_cap;
    }, 0);

    apiData.forEach( coin => {
      coin['ath_days'] = daysSinceATH(new Date(), coin.ath_date);
      coin['market_share_top100'] = ((coin.market_cap / top100_total) * 100).toFixed(2);
    })

    return apiData;
  }

  const fetchCoins = () => {
    return axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_de
    sc&per_page=100&page=1&sparkline=false`)
    .then(res => setData(prepData(res.data)))
    .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchCoins();
    
    const intervalId = setInterval(() => {
      setDate(new Date().toLocaleString())
      console.log('Interval!')
      fetchCoins()
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  return (
    <div className='App'>
      {date}

      <Table 
        columns={columns}
        data={data}
      />
    </div>
  );
}

export default App;
