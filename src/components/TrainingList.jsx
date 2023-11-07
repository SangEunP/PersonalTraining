import React, { useState, useEffect } from 'react';
import { useTable, useFilters, useGlobalFilter, useSortBy } from 'react-table';
import './List.css';
import { format } from 'date-fns';

function TrainingList() {
  const [isLoading, setIsLoading] = useState(true);
  const [trainings, setTrainings] = useState([]);
  const [isAddTrainingOpen, setIsAddTrainingOpen] = useState(false);
  const [newTraining, setNewTraining] = useState({
    date: '',
    duration: 0,
    activity: '',
    customer: '', // This will be a URL to the customer
  });
  const [customers, setCustomers] = useState([]); // State to store the list of customers

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

    // Fetch the list of customers
    fetch('https://traineeapp.azurewebsites.net/api/customers')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCustomers(data);
      })
      .catch((error) => console.error('Error fetching customer data: ', error));
  }, []);

  // Check if customers data is loaded
  const isCustomersLoaded = customers.length > 0;

  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => format(new Date(value), 'dd.MM.yyyy HH:mm'),
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
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: ({ value }) => (
          <button onClick={() => handleDeleteTraining(value)}>Delete</button>
        ),
      },
    ],
    []
  );

  function ColumnFilter({ column }) {
    return (
      <input
        value={column.filterValue || ''}
        onChange={(e) => column.setFilter(e.target.value)}
        placeholder={`Search ${column.Header}`}
      />
    );
  }

  const openAddTrainingForm = () => {
    setIsAddTrainingOpen(true);
  };

  const saveTraining = () => {
    fetch('https://traineeapp.azurewebsites.net/api/trainings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTraining),
    })
      .then((response) => {
        if (response.ok) {
          setIsAddTrainingOpen(false);
        } else {
          console.error('Error adding training:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error adding training:', error);
      });
  };

  const handleDeleteTraining = (trainingId) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this training?');
    if (shouldDelete) {
      fetch(`https://traineeapp.azurewebsites.net/api/trainings/${trainingId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            // Remove the deleted training from the state
            setTrainings((prevTrainings) =>
              prevTrainings.filter((training) => training.id !== trainingId)
            );
          } else {
            console.error('Error deleting training:', response.status);
          }
        })
        .catch((error) => {
          console.error('Error deleting training:', error);
        });
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: trainings,
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  const { globalFilter } = state;

  return (
    <div>
      <h2>Training List</h2>
      <input
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search in all columns"
      />
      <button onClick={openAddTrainingForm}>Add Training</button>
      {isAddTrainingOpen && (
        <div>
          <h3>Add Training</h3>
          <label>Date:</label>
          <input
            type="datetime-local"
            value={newTraining.date}
            onChange={(e) => setNewTraining({ ...newTraining, date: e.target.value })}
          />
          <label>Duration (minutes):</label>
          <input
            type="number"
            value={newTraining.duration}
            onChange={(e) => setNewTraining({ ...newTraining, duration: e.target.value })}
          />
          <label>Activity:</label>
          <input
            type="text"
            value={newTraining.activity}
            onChange={(e) => setNewTraining({ ...newTraining, activity: e.target.value })}
          />
          <label>Customer:</label>
          {isCustomersLoaded ? (
            <select
              value={newTraining.customer}
              onChange={(e) => setNewTraining({ ...newTraining, customer: e.target.value })}
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.url}>
                  {customer.firstname} {customer.lastname}
                </option>
              ))}
            </select>
          ) : (
            <div>Loading customers...</div>
          )}
          <button onClick={saveTraining}>Save Training</button>
        </div>
      )}
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
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
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