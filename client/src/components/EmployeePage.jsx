import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import './style.css';

const EmployeePage = () => {
  const [items, setItems] = useState([]);      // To store the search results
  const [bill, setBill] = useState([]);         // To store the items added to the bill
  const [customerName, setCustomerName] = useState(''); // To store the customer name

  // Function to handle search
  const handleSearch = async (query) => {
    try {
      const response = await axios.get('http://localhost:3001/api/items', {
        params: { search: query },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Function to handle adding an item to the bill
  const handleAdd = (item) => {
    const quantity = prompt(`Enter quantity for ${item.name}:`);

    if (quantity && !isNaN(quantity) && quantity > 0) {
      const totalPrice = item.price * quantity;
      const newItem = {
        itemName: item.name,
        quantity: parseInt(quantity),
        totalPrice: totalPrice,
      };

      // Add the item to the bill
      setBill((prevBill) => [...prevBill, newItem]);
    } else {
      alert('Invalid quantity entered. Please try again.');
    }
  };

  // Function to calculate the total price of the bill
  const calculateTotal = () => {
    return bill.reduce((total, item) => total + item.totalPrice, 0);
  };

  // Function to display the bill in a table format
  const displayBill = () => {
    if (bill.length === 0) {
      return <p>No items added to the bill yet.</p>;
    }

    const total = calculateTotal();

    return (
      <div >
        <center><h1>SM Store</h1></center>
        <table
          border="1"
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'center',
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: '8px' }}>Item Name</th>
              <th style={{ padding: '8px' }}>Quantity</th>
              <th style={{ padding: '8px' }}>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {bill.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '8px' }}>{item.itemName}</td>
                <td style={{ padding: '8px' }}>{item.quantity}</td>
                <td style={{ padding: '8px' }}>${item.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={handlePrint} style={buttonStyle}>
            Print Bill
          </button>
        </div>
      </div>
    );
  };

  // Function to handle printing the bill
  const handlePrint = () => {
    if (!customerName) {
      alert('Please enter the customer name');
      return;
    }

    const billContent = document.getElementById('bill-content').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Bill</title><style>');
    printWindow.document.write(`
      @media print {
        button { display: none; } /* Hide the print button */
        table { width: 100%; }
        th, td { padding: 10px; text-align: center; }
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(`<h3>Customer Name: ${customerName}</h3>`);
    printWindow.document.write(billContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  // Button style for print bill
  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div>
      <h1>Bill</h1>

      {/* Customer Name Input Field */}
      <input
        type="text"
        placeholder="Enter Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '20px' }}
      />

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Search Results */}
      <div>
        {items.length > 0 ? (
          <ul>
            {items.map((item) => (
              <li key={item.itemId}>
                {item.name} - ${item.price}{' '}
                <button onClick={() => handleAdd(item)} style={buttonStyle}>
                  Add
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found</p>
        )}
      </div>

      {/* Display the bill */}
      <div id="bill-content">
        {displayBill()}
      </div>
    </div>
  );
};

export default EmployeePage;
