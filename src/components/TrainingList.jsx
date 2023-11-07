import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useTable, useFilters, useGlobalFilter, useSortBy } from 'react-table';
import './List.css';

function TrainingList() {
  const [isLoading, setIsLoading] = useState(true);
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    fetch('https://traineeapp.azurewebsites.net/gettrainings')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setTrainings(data);
        setIsLoading(false);
      })
      .catch((error) => console.error('Error fetching training data: ', error));
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => moment(value).format('DD.MM.YY HH:mm'),
        Filter: ColumnFilter,
      },
      {
        Header: 'Duration (minutes)',
        accessor: 'duration',
        Filter: ColumnFilter,
      },
      {
        Header: 'Activity',
        accessor: 'activity',
        Filter: ColumnFilter,
      },
      {
        Header: 'Customer First Name',
        accessor: 'customer.firstname',
        Filter: ColumnFilter,
      },
      {
        Header: 'Customer Last Name',
        accessor: 'customer.lastname',
        Filter: ColumnFilter,
      },
    ],
    []
  );

  // Create a filter UI component
  function ColumnFilter({ column }) {
    return (
      <input
        value={column.filterValue || ''}
        onChange={(e) => column.setFilter(e.target.value)}
        placeholder={`Search ${column.Header}`}
      />
    );
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter, // Set the global filter
  } = useTable(
    {
      columns,
      data: trainings,
    },
    useFilters, // Use filters for each column
    useGlobalFilter, // Use the global filter
    useSortBy // Use sorting
  );

  // Access the global filter value from the state
  const { globalFilter } = state;

  return (
    <div>
      <h2>Training List</h2>
      <input
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search in all columns"
      />
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
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
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TrainingList;