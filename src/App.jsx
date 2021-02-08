import React, { useState, useEffect } from 'react';
import coinGecko from './api/coinGecko';

import {formatterUSD, formatterUSDFixed0, formatterFixed2, fetchCoins, prepData} from './utils/utils';

import CoinTable from './components/Table';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const columns = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: (props) => {
      const { value } = props;
      return <span>{value}</span>;
    },
  },
  {
    Header: 'Rank',
    accessor: 'market_cap_rank',
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
    Cell: (props) => {
      const { value } = props;
      return (
        <span>{formatterUSD.format(value)}</span>
      );
    },
  },
  {
    Header: '24h',
    accessor: 'price_change_percentage_24h',
    Cell: (props) => {
      const { value } = props;
      return (
        <span>{formatterFixed2.format(value)}%</span>
      );
    },
  },
  {
    Header: 'Volume',
    accessor: 'total_volume',
    Cell: (props) => {
      const { value } = props;
      return (
        <span>{formatterUSDFixed0.format(value)}</span>
      );
    },
  },
  {
    Header: 'Market Cap',
    accessor: 'market_cap',
    Cell: (props) => {
      const { value } = props;
      return (
        <span>{formatterUSDFixed0.format(value)}</span>
      );
    },
  },
  {
    Header: 'Market Share',
    accessor: 'market_share_top100',
    Cell: (props) => {
      const { value } = props;
      return (
        <span>{value}%</span>
      );
    },
  },
  {
    Header: 'Since ATH',
    accessor: 'ath_days',
    Cell: (props) => {
      const { value } = props;
      return (
        <span>{value}d</span>
      );
    },
  },
  {
    Header: 'Last updated',
    accessor: 'last_updated',
    Cell: (props) => {
      const { value } = props;
      return new Date(props.value).toLocaleString();
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

  const fetchCoins = () => {
    return coinGecko.get('/coins/markets', {
        params: {
        vs_currency: 'usd', order: 'market_cap_desc', per_page: 100, page: 1, sparkline: false,
        },
    })
    .then((res) => setData(processData(res.data)))
    .catch((err) => console.log(err));
  };

  const processData = (apiData) => {
    const top100Total = apiData.reduce((sum, curr) => sum + curr.market_cap, 0);

    apiData.forEach((coin) => {
        coin.ath_days = daysSinceATH(new Date(), coin.ath_date);
        coin.market_share_top100 = ((coin.market_cap / top100Total) * 100).toFixed(2);
    });
    return apiData;
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
        // required to allow highlighting negative values
        getCellProps={(cell) => ({ 
          style: {
            color: `${cell.value < 0 ? 'red' : ''}`, //! highleight negative numbers - 24h
          },
        })}

      />
    </div>
  );
}

export default App;
