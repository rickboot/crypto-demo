import React, { useState, useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';
import styled from "styled-components";
import api from '../api/api';
import Header from './Header';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const CoinList = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchCoins = () => {
      api.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      })
      .then((res) => {
        setCoins(res.data);
      })
      .catch((err) => console.log(err));
    };

    fetchCoins();

    // const intervalId = setInterval(() => {
    //   console.log('Interval!')
    //   fetchCoins();
    // }, 1000);

    // return () => {
    //   console.log('clearing interval')
    //   clearInterval(intervalId);
    // }

  }, []);

// REACT TABLE STUFF -----------------------------------------
  function Table({ columns, data }) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable(
      {
        columns,
        data,
        autoResetPage: false,
        autoResetSortBy: false,
        autoResetRowState: false,
      },
      useSortBy
    )

    return (
      <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  )
                })}
              </tr>
            )}
        )}
      </tbody>
    </table>
    )
  } 
  
  const columns = React.useMemo(
    () => [
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
          },
          {
            Header: '24h',
            accessor: 'price_change_percentage_24h',
          },
          {
            Header: 'Market Cap',
            accessor: 'market_cap',
          },
          {
            Header: 'Volume',
            accessor: 'total_volume',
          },
        ],
      }
    ],
    []
  )

  const data = React.useMemo(
    () => [...coins],
    [coins]
  )

  return (
    <Styles>
      <div>
        <Header />
        <Table columns={columns} data={data}/>
      </div>
    </Styles>
  );
};

export default CoinList;