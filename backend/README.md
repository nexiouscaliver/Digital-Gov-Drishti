# Corruption Complaint System Backend API

A robust backend API for a corruption complaint system, built with Flask and MongoDB.

## Features

- User registration with email verification
- OTP-based account verification
- Secure authentication with JWT
- Enterprise-grade error handling and logging
- Document storage with GridFS
- RESTful API design

## Tech Stack

- **Python 3.9+**
- **Flask**: Web framework
- **MongoDB**: Database
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **SMTP**: Email sending

## API Endpoints

### Authentication

- **POST /api/register**: Register a new user
- **POST /api/login**: Authenticate a user
- **POST /api/verify-otp**: Verify an OTP code
- **POST /api/resend-otp**: Resend OTP code

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Flask
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key

# MongoDB
MONGODB_USERNAME=your-mongodb-username
MONGODB_PASSWORD=your-mongodb-password
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_TYPE=local

# Email
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-email-password
MAIL_DEFAULT_SENDER=your-email@gmail.com
```

## Setup and Installation

### Prerequisites

- Python 3.9+
- MongoDB
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/corruption-complaint-system.git
cd corruption-complaint-system/backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate
# Unix or macOS
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Set up environment variables as described above.

6. Run the application:
```bash
python run.py
```

## Development

### Project Structure

```
backend/
├── app/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── errors/          # Error handlers
│   ├── __init__.py      # Application factory
│   ├── config.py        # Configuration
│   └── main.py          # App entry point
├── tests/               # Unit tests
├── requirements.txt     # Dependencies
├── run.py               # Run script
└── README.md            # Documentation
```

## Testing

Run tests with pytest:

```bash
pytest
```

## Deployment

For production deployment:

1. Set `FLASK_ENV=production` in your environment variables
2. Use Gunicorn to run the application:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 backend.run:app
```

## Security Considerations

- All passwords are hashed with bcrypt
- Authentication is done via JWT tokens
- Input validation is performed on all endpoints
- OTP verification ensures secure registration
- Environment variables are used for sensitive information

## License

MIT 