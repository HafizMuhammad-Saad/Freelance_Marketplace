import express from 'express';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/User';
import Gig from './models/Gig';


const app = express();
app.use(express.json());


// Connect to MongoDB
mongoose.connect('mongodb+srv://studentsaad41:Lb1AbHVkmc5sIfsI@cluster0.gjfyh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

// Auth middleware
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key') as { userId: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};


// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['freelancer', 'client']).withMessage('Invalid role'),
  ],
  async (req: Request, res: Response) => {
    console.log('Request Body:', req.body);

    // Validate user input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Explicitly return to avoid TypeScript errors
    }

    const { name, email, password, role } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return; // Explicitly return
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();

      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

      res.status(201).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

app.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response) => {
    // Validate user input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Explicitly return
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return; // Explicitly return
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid credentials' });
        return; // Explicitly return
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);


// Create a gig
app.post(
  '/gigs',
  authMiddleware,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  async (req: Request, res: Response) => {
    // Validate user input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Explicitly return
    }

    const { title, description, price, category } = req.body;

    try {
      // Get the user ID from the JWT token
      const userId = (req as any).user.userId;

      // Create a new gig
      const gig = new Gig({ title, description, price, category, createdBy: userId });
      await gig.save();

      res.status(201).json(gig);
    } catch (err) {
      console.error('Error creating gig:', err); // Log the detailed error

      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all gigs
app.get('/gigs', async (req: Request, res: Response) => {
  try {
    const gigs = await Gig.find().populate('createdBy', 'name email');
    res.status(200).json(gigs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single gig
app.get('/gigs/:id', async (req: Request, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('createdBy', 'name email');
    if (!gig) {
      res.status(404).json({ message: 'Gig not found' });
      return; // Explicitly return
    }
    res.status(200).json(gig);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a gig
app.put('/gigs/:id',authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, description, price, category } = req.body;

    const gig = await Gig.findById(req.params.id);
    if (!gig) {
       res.status(404).json({ message: 'Gig not found' });
       return // Explicitly return
    }

    // Check if the user is the owner of the gig
    const userId = (req as any).user.userId;
    if (gig.createdBy.toString() !== userId) {
       res.status(403).json({ message: 'Unauthorized' });
       return // Explicitly return
    }

    gig.title = title || gig.title;
    gig.description = description || gig.description;
    gig.price = price || gig.price;
    gig.category = category || gig.category;
    await gig.save();

    res.status(200).json(gig);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a gig
app.delete('/gigs/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
       res.status(404).json({ message: 'Gig not found' });
       return // Explicitly return
    }

    // Check if the user is the owner of the gig
    const userId = (req as any).user.userId;
    if (gig.createdBy.toString() !== userId) {
       res.status(403).json({ message: 'Unauthorized' });
       return // Explicitly return
    }

    await gig.deleteOne();
    res.status(200).json({ message: 'Gig deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


export default authMiddleware;

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});