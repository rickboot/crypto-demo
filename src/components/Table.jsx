import React from 'react';
import { useTable, useSortBy } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import iconUp from '../assets/caret-up-fill.svg';
import iconDown from '../assets/caret-down-fill.svg';

const defaultPropGetter = () => ({}); //! for custom method to format negative numbers

function CoinTable({
  columns,
  data,
  getColumnProps = defaultPropGetter, //! for custom method to format negative numbers
  getCellProps = defaultPropGetter, //! for custom method to format negative numbers
}) {
  const instance = useTable(
    {
      columns,
      data,
      autoResetSortBy: false,
    },
    useSortBy, //! required for column sort
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = instance;

  return (
    <div className="table-responsive">
      <table className="table table-light table-striped table-hover" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {/* //! add sort direction indicators */}
                    {column.isSorted ? (column.isSortedDesc
                      ? <img className="icon" src={iconDown} alt="down" />
                      : <img className="icon" src={iconUp} alt="up" />)
                      : <img className="transparent" src={iconDown} alt="sortable" />}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps([
                      {
                        className: cell.column.className,
                        style: cell.column.style,
                      },
                      getColumnProps(cell.column),
                      getCellProps(cell),
                    ])}
                    //! data label for responsive css
                    data-label={cell.column.Header}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
          ;
        </tbody>
      </table>

    </div>
  );
}

export default CoinTable;
