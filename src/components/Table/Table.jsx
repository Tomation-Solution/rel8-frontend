import { useMemo } from 'react';
import { useTable } from 'react-table';
import PropTypes from 'prop-types';
import './Table.css';

const Table = ({ prop_columns = [], custom_data = [] }) => {
  const columns = useMemo(() => prop_columns, [prop_columns]);
  const data = useMemo(() => custom_data, [custom_data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  const handleRowRoute = (id) => {
    console.log(id);
    // This would send the page to a detail page
  };

  return (
    <div className='p-2 registration-table'>
      <table {...getTableProps()} className='table'>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  {...column.getHeaderProps()}
                  key={columnIndex}
                  className={`bg-org-primary text-center text-white text-sm font-semibold border-b capitalize pt-3 px-4 pb-4 min-w-[100px]`}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={index}
                className="hover:bg-gray-50 transition-colors"
              >
                {row.cells.map((cell, cellIndex) => (
                  <td
                    {...cell.getCellProps()}
                    key={cellIndex}
                    className="text-center py-3 px-4 border-b text-sm"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  prop_columns: PropTypes.array,
  custom_data: PropTypes.array,
};

export default Table;