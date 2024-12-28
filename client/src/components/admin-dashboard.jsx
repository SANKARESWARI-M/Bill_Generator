import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
  const [code, setCode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [items, setItems] = useState([]);
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState(""); // Track updated price
  const [editingItemId, setEditingItemId] = useState(null); // Track which item is being edited
  const adminCode = "12345"; // Replace with your actual admin code

  // Fetch items when the component mounts
  useEffect(() => {
    if (isAuthorized) {
      fetchItems();
    }
  }, [isAuthorized]);

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (code === adminCode) {
      setIsAuthorized(true);
    } else {
      alert("Invalid admin code!");
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:3001/items");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddItem = async () => {
    if (!itemId || !itemName || !itemPrice) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/addItem", {
        itemId: itemId,
        name: itemName,
        price: itemPrice,
      });
      setItems([...items, response.data]);
      setItemId("");
      setItemName("");
      setItemPrice("");
    } catch (error) {
      console.error("Error adding item:", error);
      alert(error.response?.data?.message || "Error adding item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    console.log('Deleting item with ID:', itemId);
    try {
        await axios.delete(`http://localhost:3001/api/items/${itemId}`);
        fetchItems(); // Refresh the item list
    } catch (error) {
        console.error('Error deleting item:', error.response?.data || error.message);
    }
  };

  const handleUpdateItem = async (itemId, newPrice) => {
    if (!newPrice || isNaN(newPrice)) {
      console.error("New price is required and should be a valid number");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/items/${itemId}`, {
        price: newPrice, // Ensure price is sent as a number
      });
      fetchItems(); // Refresh the list after successful update
      setEditingItemId(null); // Stop editing after update
    } catch (error) {
      console.error("Error updating item:", error.response?.data || error.message);
    }
  };

  const handleEditClick = (itemId, currentPrice) => {
    setEditingItemId(itemId); // Set the item ID that is being edited
    setUpdatedPrice(currentPrice); // Set the current price as the default value
  };

  if (!isAuthorized) {
    return (
      <div>
        <h1>Admin Dashboard</h1>
        <form onSubmit={handleCodeSubmit}>
          <input
            type="password"
            placeholder="Enter Admin Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, Admin</h1>
      <div>
        <h2>Add Item</h2>
        <input
          type="text"
          placeholder="Item ID (unique)"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Item Price"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <div>
        <h2>Item List</h2>
        <button onClick={fetchItems}>Refresh Items</button>
        <ul>
  {items.map((item) => (
    <li key={item.itemId}>
      {item.itemId}: {item.name} - ${item.price}
      {editingItemId !== item.itemId ? (
        <button onClick={() => handleEditClick(item.itemId, item.price)}>
          Update Price
        </button>
      ) : (
        <div>
          <input
            type="number"
            placeholder="New Price"
            value={updatedPrice}
            onChange={(e) => setUpdatedPrice(e.target.value)} 
          />
          <button onClick={() => handleUpdateItem(item.itemId, updatedPrice)}>
            Save
          </button>
          <button onClick={() => setEditingItemId(null)}>Cancel</button>
        </div>
      )}
      <button onClick={() => handleDeleteItem(item.itemId)}>Delete</button>
    </li>
  ))}
</ul>

      </div>
    </div>
  );
}

export default AdminDashboard;
