import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './List.css';

Modal.setAppElement('#root');

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    firstname: '',
    lastname: '',
    email: '',
    streetaddress: '',
    postcode: '',
    city: '',
    phone: '',
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://traineeapp.azurewebsites.net/api/customers')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.content) {
          const customersArray = Object.values(data.content);
          setCustomers(customersArray);
        } else {
          console.error('Data does not have a content property:', data);
        }
      })
      .catch((error) => console.error('Error fetching customer list: ', error));
  }, []);

  const handleAddCustomer = () => {
    setIsModalOpen(true);
    setFormData({
      id: null,
      firstname: '',
      lastname: '',
      email: '',
      streetaddress: '',
      postcode: '',
      city: '',
      phone: '',
    });
  };

  const handleEditCustomer = (customer) => {
    setIsModalOpen(true);
    setFormData({ ...customer });
  };

  const handleDeleteCustomer = (customer) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this customer?');
    if (shouldDelete) {
      if (customer && customer.links) {
        const customerId = customer.links.find((link) => link.rel === 'self').href.split('/').pop();

        fetch(`https://traineeapp.azurewebsites.net/api/customers/${customerId}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (response.ok) {
              console.log('Deleted successfully.');
            } else {
              console.error('Error deleting customer:', response.status);
            }
          })
          .catch((error) => {
            console.error('Error deleting customer:', error);
          });
      } else {
        console.error('Invalid customer object or missing links property.');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveCustomer = () => {
    if (formData.id) {
      fetch(`https://traineeapp.azurewebsites.net/api/customers/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            const updatedCustomers = customers.map((customer) =>
              customer.id === formData.id ? { ...customer, ...formData } : customer
            );
            setCustomers(updatedCustomers);
            setIsModalOpen(false);
          }
        })
        .catch((error) => console.error('Error updating customer: ', error));
    } else {
      fetch('https://traineeapp.azurewebsites.net/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            const newCustomer = {
              id: customers.length + 1,
              ...formData,
            };
            setCustomers([...customers, newCustomer]);
            setIsModalOpen(false);
          }
        })
        .catch((error) => console.error('Error adding customer: ', error));
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstname} ${customer.lastname}`;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Function to convert customer data to CSV format
  const convertToCSV = () => {
    const header = [
      'First Name',
      'Last Name',
      'Email',
      'Street Address',
      'Post Code',
      'City',
      'Phone',
    ];

    const rows = customers.map((customer) => [
      customer.firstname,
      customer.lastname,
      customer.email,
      customer.streetaddress,
      customer.postcode,
      customer.city,
      customer.phone,
    ]);

    return [header, ...rows].map((row) => row.join(',')).join('\n');
  };

  // Function to trigger download of CSV file
  const downloadCSV = () => {
    const csv = convertToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_data.csv';
    a.click();
  };

  return (
    <div>
      <h2>Customer List</h2>
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleAddCustomer}>Add Customer</button>
        <button onClick={downloadCSV}>Export</button> {/* Export button */}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Street Address</th>
            <th>Post Code</th>
            <th>City</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.firstname}</td>
              <td>{customer.lastname}</td>
              <td>{customer.email}</td>
              <td>{customer.streetaddress}</td>
              <td>{customer.postcode}</td>
              <td>{customer.city}</td>
              <td>{customer.phone}</td>
              <td>
                <button onClick={() => handleEditCustomer(customer)}>EDIT</button>
                <button onClick={() => handleDeleteCustomer(customer)}>DELETE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel={formData.id ? 'Edit Customer Modal' : 'Add Customer Modal'}
      >
        <h2>{formData.id ? 'Edit Customer' : 'Add Customer'}</h2>
        <form>
          <div>
            <label htmlFor="firstname">First Name: </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleFormChange}
              disabled={!!formData.id}
            />
          </div>
          <div>
            <label htmlFor="lastname">Last Name: </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label htmlFor="streetaddress">Street Address: </label>
            <input
              type="text"
              id="streetaddress"
              name="streetaddress"
              value={formData.streetaddress}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label htmlFor="postcode">Post Code: </label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label htmlFor="city">City: </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label htmlFor="phone">Phone: </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
            />
          </div>
        </form>
        <button onClick={handleSaveCustomer}>
          {formData.id ? 'Save Changes' : 'Add Customer'}
        </button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
}

export default CustomerList;