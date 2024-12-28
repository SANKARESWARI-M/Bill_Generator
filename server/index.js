/*const express= require("express")
const mongoose=require("mongoose")
const app=express()

mongoose.connect("mongodb+srv://user1:aMRY8g4tmHZmNlU3@cluster0.an4c1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
const userSchema=new mongoose.Schema({
    name:String,
    age:Number,
})

const userModel=mongoose.model("items",userSchema);
const emp1=new userModel({
    name:"san",
    age:20
})
emp1.save();
app.listen('3001',()=>{
    console.log("server is running");

});*/

/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./model/user");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    credentials: true
}));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { id: user._id, name: user.name, email: user.email };
                // console.log(email);
                console.log(user.name);
                res.json("Success");
            } else {
                res.status(401).json("Password doesn't match");
            }
        } else {
            res.status(404).json("No Records found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ error: "Failed to logout" });
            } else {
                res.status(200).json("Logout successful");
            }
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
});

app.get('/user', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json("Not authenticated");
    }
});*/


/*
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./model/user");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

const itemSchema = new mongoose.Schema({
    _id: { type: String, required: true,unique: true }, // Unique item ID
    name: { type: String, required: true },
    price: { type: Number, required: true },
  });



// User Routes
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { id: user._id, name: user.name, email: user.email };
                res.json("Success");
            } else {
                res.status(401).json("Password doesn't match");
            }
        } else {
            res.status(404).json("No Records found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ error: "Failed to logout" });
            } else {
                res.status(200).json("Logout successful");
            }
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
});

app.get('/user', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json("Not authenticated");
    }
});
// Define the Item schema and model


const Item = mongoose.model("Item", itemSchema);

app.get("/items", async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Error fetching items" });
    }
  });
  
  // Add a new item
  app.post("/items", async (req, res) => {
    try {
      const { _id, name, price } = req.body;
      if (!_id || !name || !price) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newItem = new Item({ _id, name, price });
      await newItem.save();
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error adding item:", error);
      res.status(500).json({ message: "Error adding item" });
    }
  });
  
  // Update an item's price
  app.put("/items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { price } = req.body;
  
      if (!price) {
        return res.status(400).json({ message: "Price is required" });
      }
  
      const updatedItem = await Item.findByIdAndUpdate(
        id,
        { price },
        { new: true }
      );
  
      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
  
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ message: "Error updating item" });
    }
  });
  
  // Delete an item
  app.delete("/items/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedItem = await Item.findByIdAndDelete(id);
  
      if (!deletedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
  
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Error deleting item" });
    }
  });
  
*/

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./model/user");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow cookies to be sent
}));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));




const itemSchema = new mongoose.Schema({
    itemId: { type: String, required: true }, // Unique custom ID
    name: { type: String, required: true },
    price: { type: Number, required: true },
});

const Item = mongoose.model("Item", itemSchema);

// User Routes
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { id: user._id, name: user.name, email: user.email };
                res.json("Success");
            } else {
                res.status(401).json("Password doesn't match");
            }
        } else {
            res.status(404).json("No Records found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ error: "Failed to logout" });
            } else {
                res.status(200).json("Logout successful");
            }
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
});

app.get('/user', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json("Not authenticated");
    }
});

// Routes for Item management
app.get("/items", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Error fetching items" });
    }
});

app.post("/addItem", async (req, res) => {
    try {
        const { itemId, name, price } = req.body;

        if (!itemId || !name || !price) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newItem = new Item({
            itemId: itemId,  // Custom itemId
            name: name,
            price: price,
          });
        await newItem.save();

        res.status(201).json(newItem);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            res.status(409).json({ error: "Item ID must be unique" });
        } else {
            console.error("Error adding item:", error);
            res.status(500).json({ error: "An error occurred while adding the item." });
        }
    }
});

app.put("/api/items/:itemId", async (req, res) => {
    const { itemId } = req.params;
    const { price } = req.body;
  
    if (!price) {
      return res.status(400).send("Price is required");
    }
  
    try {
      const updatedItem = await Item.findOneAndUpdate(
        { itemId: itemId },
        { price: price },
        { new: true } // Returns the updated document
      );
  
      if (!updatedItem) {
        return res.status(404).send("Item not found");
      }
  
      res.status(200).send(updatedItem);
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).send("Error updating item");
    }
  });
  
  
  
  app.delete('/api/items/:itemId', async (req, res) => {
    const { itemId } = req.params;

    // Debugging logs
    console.log('Received itemId:', itemId);
    console.log('Type of itemId:', typeof itemId);

    try {
        // Find and delete the item using itemId as a string
        const deletedItem = await Item.findOneAndDelete({ itemId: String(itemId) });

        if (!deletedItem) {
            console.log('Item not found in database for itemId:', itemId);
            return res.status(404).json({ message: 'Item not found' });
        }

        console.log('Deleted item:', deletedItem);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


  
  
// Search API
app.get('/api/items', async (req, res) => {
    const { search } = req.query;

    try {
        const regex = new RegExp(search, 'i'); // Case-insensitive search
        const items = await Item.find({
            $or: [{ itemId: regex }, { name: regex }],
        });

        if (items.length === 0) {
            return res.status(404).json({ error: 'No matching items found' });
        }

        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

  
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});