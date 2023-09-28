
Video Upload and Display Backend
This is the backend component of a simple Node.js application built with Express that allows users to upload videos and view a list of uploaded videos.

Features
Video Upload: Users can upload video files (e.g., .mp4, .avi, .mkv) up to 50MB in size.

Video Display: Users can retrieve a list of uploaded videos.

Prerequisites
Before running this backend server, make sure you have the following prerequisites installed:

Node.js and npm: You can download and install them from nodejs.org.
Installation
Clone the repository to your local machine:

bash
Copy code
git clone <https://github.com/urizennnn/HNG-chrome-extension-BE.git>
Navigate to the project directory:

bash
Copy code
cd <project-directory>
Install the project dependencies:

bash
Copy code
npm install
Usage
Starting the Server
To start the server, run the following command:

bash
Copy code
npm start
The server will start running at https://chrome-ext-server.onrender.com by default. You can change the port in the server.js file.

API Routes
GET /: A test route that returns a "Hello" message.

POST /api/HNG/uploadfile: Allows users to upload video files. The following rules apply:
Navigate to Body -> form-data 
Your body should be as follows
key->video
value->file->choose file 
Hit send

Uploaded files must be videos.
Uploaded files must not exceed 50MB in size.
GET /api/HNG/showvideos: Retrieves a list of uploaded videos and their URLs.

File Upload
When uploading a video file, make a POST request to /api/HNG/uploadfile with a form data field named video containing the video file.

Viewing Uploaded Videos
To view the list of uploaded videos, make a GET request to /api/HNG/showvideos. This route will return a JSON response with URLs to the uploaded videos.

Technologies Used
Node.js
Express.js
http-status-codes
express-fileupload
fs.promises
Configuration
You can configure this server by modifying the environment variables in the .env file.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Author
Akaaha Victor Chukwunweike
