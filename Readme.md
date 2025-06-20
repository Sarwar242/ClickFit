# Click Fit - Fitness Website

A modern, responsive fitness website built with HTML, CSS, JavaScript, Bootstrap, jQuery, Node.js, and MySQL.

## Features

- **Responsive Design**: Mobile-first design that works on all devices
- **Animated UI**: Smooth animations and transitions using CSS and Animate.css
- **Daily Fun Facts**: AJAX integration with Numbers API to display interesting daily facts
- **Image Upload**: Drag & drop file upload functionality with progress tracking
- **Modern Styling**: Contemporary design with gradients, glassmorphism effects, and smooth animations
- **Database Integration**: MySQL database with users table and stored procedures

## Tech Stack

### Frontend
- HTML5
- CSS3 (with modern features like gradients, flexbox, animations)
- JavaScript (ES6+)
- Bootstrap 5.3.0
- jQuery 3.7.0
- Font Awesome 6.4.0
- Animate.css 4.1.1

### Backend
- Node.js
- Express.js
- Multer (for file uploads)
- CORS

### Database
- MySQL
- Stored Procedures

## Project Structure

```
clickfit-website/
├── server.js              # Node.js server
├── package.json           # Node.js dependencies
├── public/
│   └── index.html         # Main website file
├── upload_images/         # Directory for uploaded images (auto-created)
├── database/
│   └── setup.sql          # MySQL database setup script
└── README.md              # This file
```

## Setup Instructions

### 1. Prerequisites

Make sure you have the following installed:
- Node.js (v14 or higher)
- npm (comes with Node.js)
- MySQL Server (v5.7 or higher)

### 2. Installation

1. **Clone or download the project files**

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   - Start your MySQL server
   - Run the SQL script to create the database structure:
   ```sql
   mysql -u your_username -p < database/setup.sql
   ```
   Or copy and paste the contents of the setup.sql file into your MySQL client

4. **Create the upload directory:**
   The `upload_images` directory will be created automatically when you start the server.

### 3. Running the Application

1. **Start the Node.js server:**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

2. **Access the website:**
   Open your browser and go to: `http://localhost:3000`

## API Endpoints

### File Upload
- **POST** `/upload`
  - Upload multiple image files
  - Supports: JPG, JPEG, PNG, GIF, BMP, WEBP
  - Maximum file size: 5MB per file
  - Maximum files: 10 files per request

### Get Images
- **GET** `/images`
  - Retrieve list of all uploaded images

### Static Files
- **GET** `/uploaded-images/:filename`
  - Serve uploaded image files

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    type ENUM('admin', 'trainer', 'member') NOT NULL DEFAULT 'member',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Stored Procedures

#### addUser
Adds a new user to the database with validation:
```sql
CALL addUser(email, password, type, active, @userId, @success, @message);
```

**Parameters:**
- `email`: User's email address
- `password`: User's password (should be hashed)
- `type`: User type ('admin', 'trainer', 'member')
- `active`: User status (TRUE/FALSE)

**Output:**
- `userId`: Generated user ID
- `success`: Boolean indicating success/failure
- `message`: Success or error message

## Features Overview

### 1. Modern UI/UX
- Gradient backgrounds and modern color schemes
- Smooth animations and hover effects
- Responsive design for all screen sizes
- Glassmorphism effects and contemporary styling

### 2. Daily Fun Facts
- Integrates with Numbers API to fetch interesting historical facts
- AJAX call to `http://numbersapi.com/1/30/date?json`
- Displays facts based on current date
- Fallback motivational quotes if API fails

### 3. Image Upload System
- Drag and drop interface
- Click to select files
- Progress bar during upload
- File type validation (images only)
- File size limits (5MB per file)
- Multiple file support (up to 10 files)

### 4. Animations
- CSS keyframe animations for floating elements
- Scroll-triggered animations using Intersection Observer
- Hover effects on interactive elements
- Loading animations and progress indicators

## Development Notes

- The website uses only the main page - other navigation links will show 404 errors as requested
- Image uploads are handled locally (no cloud storage)
- The design prioritizes visual appeal and modern web standards
- All animations are optimized for performance
- The code follows best practices for maintainability

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is for demonstration purposes. Feel free to use and modify as needed.

## Troubleshooting

### Common Issues

1. **Port already in use:**
   - Change the PORT in server.js or kill the process using port 3000

2. **File upload not working:**
   - Check that the upload_images directory exists and has write permissions
   - Verify file size is under 5MB
   - Ensure file is a valid image format

3. **Database connection issues:**
   - Verify MySQL server is running
   - Check database credentials
   - Ensure the database and tables exist

4. **Daily facts not loading:**
   - Check internet connection
   - The Numbers API might be temporarily unavailable
   - Fallback content will be displayed

## Contact

For questions or issues, please refer to the code comments or create an issue in the project repository.