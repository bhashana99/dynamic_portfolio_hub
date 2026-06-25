# Dynamic Portfolio Hub

Dynamic Portfolio Hub is a fully customizable portfolio website built using the MERN stack. It allows users to create, edit, and manage their portfolios effortlessly. This project showcases my skills in web development and provides a platform for others to showcase their work as well.

## Features

- **User Authentication**: Secure login and registration system.
- **Portfolio Management**: Users can create, edit, and delete their portfolios.
- **Dynamic Content**: Easily update portfolio details like projects, experiences, and skills.
- **Responsive Design**: Works seamlessly across devices and screen sizes.
- **Admin Panel**: Manage user accounts and oversee content.

## Technologies Used

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Image/File Storage**: Cloudinary
- **Deployment**: Render.com

## Demo

Check out the live demo: [Demo Link](https://portfolio-template-4kpe.onrender.com/)

## Editing Panel Credentials

To customize your portfolio, use the editing panel:
- **Username**: `username1`
- **Password**: `password1`

You can log in to the editing panel, make changes to your portfolio in real-time, and save your customizations. The changes will be reflected immediately.


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bhashana99/my-portfolio.git

2. Navigate to the project directory:
   ```bash
   cd dynamic-portfolio-hub
3. Install dependencies for the back-end:
    ```bash
      cd back-end
      npm install
4. Install dependencies for the client:
   ```bash
   cd front-end
   npm install
5. Create a `.env` File in the Root Directory
   - Add your MongoDB connection string and the other backend environment variables:
     ```env
     MONGO=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```
   - Create a free Cloudinary account at https://cloudinary.com and copy the
     Cloud name, API Key, and API Secret from your dashboard. Image and CV
     uploads are handled by the backend (`POST /api/upload`) and stored on
     Cloudinary, so no frontend keys are required.
6. Open Postman & Create a New Post Request for Register User:
   - Use Postman to send requests for user registration and any other necessary API calls.'
7. Customize Your Portfolio
   - Go to the portfolio footer, click the edit page, log in, and customize your portfolio as desired.

### For More Details

For more detailed instructions on how to use the customizable portfolio template, refer to [this article](https://medium.com/@bhashanachamodya99/how-to-use-my-customizable-portfolio-template-55d82c6cec90).
