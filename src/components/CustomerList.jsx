import React, { useState, useEffect } from 'react';
import { useTable, useSortBy, useFilters, useGlobalFilter } from 'react-table';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const columns = React.useMemo(
    () => [
      {
        Header: 'First Name',
        accessor: 'firstname',
      },
      {
        Header: 'Last Name',
        accessor: 'lastname',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Street Address',
        accessor: 'streetaddress',
      },
      {
        Header: 'Post Code',
        accessor: 'postcode',
      },
      {
        Header: 'City',
        accessor: 'city',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
    ],
    []
  );

  useEffect(() => {
    // Fetch the list of customers and update the state
    fetch('http://traineeapp.azurewebsites.net/api/customers')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.content) {
          // Convert the object into an array
          const customersArray = Object.values(data.content);
          setCustomers(customersArray);
        } else {
          console.error('Data does not have content property:', data);
        }
      })
      .catch((error) => console.error('Error fetching customer list: ', error));
  }, []);

  // Use react-table to create a table with sorting, filtering, and searching
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state,
  } = useTable(
    {
      columns,
      data: customers,
      initialState: {
        // You can specify initial sorting or other settings here
      },
    },
    useFilters, // Enable filters
    useGlobalFilter, // Enable global filtering
    useSortBy // Enable sorting
  );

  const { globalFilter } = state;

  return (
    <div>
      <h2>Customer List</h2>
      <div>
        <label htmlFor="search">Search: </label>
        <input
          id="search"
          type="text"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value || undefined)}
        />
      </div>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
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

export default CustomerList;