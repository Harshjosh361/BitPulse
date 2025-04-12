# BitPulse

A modern web application built with Next.js, featuring authentication, QR code generation, and data visualization capabilities.

## 🚀 Features

- Next.js 15 with App Router
- Authentication with NextAuth.js
- MongoDB integration with Mongoose
- QR Code generation
- Data visualization with Recharts
- Modern UI with Tailwind CSS
- JWT-based authentication
- Secure password hashing with bcryptjs

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- MongoDB database
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 🚀 Getting Started

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Data Visualization**: Recharts
- **QR Code**: qrcode.react
- **Security**: bcryptjs, jsonwebtoken

## 📚 Project Structure

```
my-app/
├── src/              # Source code
├── models/           # Database models
├── public/           # Static assets
├── .env.local        # Environment variables
└── package.json      # Project dependencies
```

## 🔒 Security

- Password hashing with bcryptjs
- JWT-based authentication
- Environment variable protection
- Secure session management with NextAuth.js

## 📈 Data Visualization

The application uses Recharts for creating interactive and responsive charts and graphs.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
