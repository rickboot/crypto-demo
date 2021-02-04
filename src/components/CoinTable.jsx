import React from 'react'
import { useTable } from 'react-table'

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const data = React.useMemo(
  () => [
    {
      col1: 'react-table',
      col2: 'rocks',
    },
    {
      col1: 'whatever',
      col2: 'you want',
    },
    {
      col1: 'Hello',
      col2: 'World',
    },
    {
      col1: 'react-table',
      col2: 'rocks',
    },
    {
      col1: 'whatever',
      col2: 'you want',
    },
    {
      col1: 'Hello',
      col2: 'World',
    },
    {
      col1: 'react-table',
      col2: 'rocks',
    },
    {
      col1: 'whatever',
      col2: 'you want',
    },
  ],
  []
)

const columns = React.useMemo(
  () => [
        {
          Header: 'Icon',
          accessor: 'coin.image',
        },
        {
          Header: 'Name',
          accessor: 'coin.name',
        },
        {
          Header: 'Symbol',
          accessor: 'coin.symbol',
        },
        {
          Header: 'Price',
          accessor: 'coin.current_price',
        },
        {
          Header: '24h',
          accessor: 'coin.price_change_percentage_24h',
        },
        {
          Header: '7d',
          accessor: 'coin.price_change_percentage_7d',
        },
        {
          Header: 'Market Cap',
          accessor: 'coin.market_cap',
        },
        {
          Header: 'Volume',
          accessor: 'coin.total_volume',
        },
      ],
  []
)

  return (
      <Table columns={columns} data={data} />
  )
}

export default CoinTable;