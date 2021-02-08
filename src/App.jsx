import React, { useState, useEffect } from 'react';
import axios from './api/coinGecko';
import CoinTable from './components/Table';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const formatterUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const formatterFixed0 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const columns = [
  {
    Header: 'Name',
    accessor: 'name',
    // Cell: props => <strong>{props.value}</strong>
    Cell: (props) => {
      const { value } = props;
      return <span>{value}</span>;
    },
  },
  {
    Header: 'Rank',
    accessor: 'market_cap_rank',
    // Cell: props => <span>{props.value}</span>
    Cell: (props) => {
      const { value } = props;
      return <span>{value}</span>;
    },
  },
  {
    Header: 'Symbol',
    accessor: 'symbol',
  },
  {
    Header: 'Price',
    accessor: 'current_price',
    // Cell: props => formatterUSD.format(props.value)
    Cell: (props) => {
      const { value } = props;
      return (
        <span>
          {formatterUSD.format(value)}
          %
        </span>
      );
    },
  },
  {
    Header: '24h',
    accessor: 'price_change_percentage_24h',
    // Cell: props => <span>{formatterUSD.format(props.value)}%</span>
    Cell: (props) => {
      const { value } = props;
      return (
        <span>
          {formatterUSD.format(value)}
        </span>
      );
    },
  },
  {
    Header: 'Market Cap',
    accessor: 'market_cap',
    // Cell: props => formatterFixed0.format(props.value)
    Cell: (props) => {
      const { value } = props;
      return (
        <span>
          {formatterFixed0.format(value)}
          %
        </span>
      );
    },
  },
  {
    Header: 'Volume',
    accessor: 'total_volume',
    // Cell: props => formatterFixed0.format(props.value)
    Cell: (props) => {
      const { value } = props;
      return (
        <span>
          {formatterFixed0.format(value)}
          %
        </span>
      );
    },
  },
  {
    Header: 'Last updated',
    accessor: 'last_updated',
    // Cell: props => new Date(props.value).toLocaleString()
    Cell: (props) => {
      const { value } = props;
      return new Date(props.value).toLocaleString();
    },
  },
  {
    Header: 'Since ATH',
    accessor: 'ath_days',
    // Cell: props => <span>{props.value}d</span>
    Cell: (props) => {
      const { value } = props;
      return (
        <span>
          {value}
          d
        </span>
      );
    },
  },
  {
    Header: 'Market Share',
    accessor: 'market_share_top100',
    // Cell: props => <span>{props.value}%</span>
    Cell: (props) => {
      const { value } = props;
      return (
        <span>
          {value}
          %
        </span>
      );
    },
  }
];

function App() {
  const [data, setData] = useState([{}]);
  const [date, setDate] = useState(new Date().toLocaleString());

  const daysSinceATH = (priorDateStr, newerDateStr) => {
    const diff = new Date(priorDateStr).getTime() - new Date(newerDateStr).getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
  };

  const prepData = (apiData) => {
    const top100Total = apiData.reduce((sum, curr) => sum + curr.market_cap, 0);

    apiData.forEach((coin) => {
      coin.ath_days = daysSinceATH(new Date(), coin.ath_date);
      coin.market_share_top100 = ((coin.market_cap / top100Total) * 100).toFixed(2);
    });

    return apiData;
  };

  const fetchCoins = () => {
    return axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_de
    sc&per_page=100&page=1&sparkline=false`)
    .then((res) => setData(prepData(res.data)))
    .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCoins();

    const intervalId = setInterval(() => {
      setDate(new Date().toLocaleString());
      fetchCoins();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      <Header date={date} />
      <CoinTable
        columns={columns}
        data={data}
        getCellProps={(cell) => ({
          style: {
            color: `${cell.value < 0 ? 'red' : 'black'}`,
          },
        })}

      />
    </div>
  );
}

export default App;
