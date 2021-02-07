// import React, { useState, useEffect } from 'react';
import React from 'react';
import { useTable, useSortBy } from 'react-table';

import 'bootstrap/dist/css/bootstrap.min.css';
// import BTable from 'react-bootstrap/Table';


import iconUp from '../assets/caret-up-fill.svg';
import iconDown from '../assets/caret-down-fill.svg';



const defaultPropGetter = () => ({})


function CoinTable({ columns, data,

  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,

}) {
  
  const instance = useTable (
    {
      columns,
      data,
      autoResetSortBy: false,
    },
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = instance;
  
  return (
    <table className="table table-light table-striped table-hover"   {...getTableProps()}>
    <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
              {column.render('Header')}
              <span>
                {column.isSorted ? (column.isSortedDesc 
                  ? <img className='icon' src={iconUp} alt='up'></img> :
                    <img className='icon' src={iconDown} alt='down'></img> ) 
                  : <img className="transparent" src={iconDown} alt='down'></img>
                }
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
                  <td 
                    {...cell.getCellProps(
                    
                      [
                        {
                          className: cell.column.className,
                          style: cell.column.style,
                        },
                        getColumnProps(cell.column),
                        getCellProps(cell),
                      ]

                    )}
                    data-label={cell.column.Header}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )}
      )}
    </tbody>
  </table>
  )
};

export default CoinTable;
