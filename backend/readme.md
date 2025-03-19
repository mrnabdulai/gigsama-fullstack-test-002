# Backend Project

This is a Node.js backend project built with TypeScript and Express.

## Project Setup

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

or

```bash
yarn install
```

## Scripts

- `npm run dev`: Start the development server with nodemon
- `npm run build`: Compile TypeScript to JavaScript
- `npm run start`: Start the production server
- `npm run test`: Run tests (currently not implemented)
- `npm run postbuild`: Copy EJS files to the dist folder after build

## Project Structure

The project uses module aliases for better import management:

- `@models`: Maps to `dist/models`
- `@config`: Maps to `dist/config`
- `@context`: Maps to `dist/context`
- `@services`: Maps to `dist/services`

## Dependencies

### Main Dependencies

- Express: Web application framework
- Mongoose: MongoDB object modeling
- Firebase: Firebase SDK
- JsonWebToken: JWT implementation
- Bcrypt: Password hashing
- Axios: HTTP client
- Dayjs: Date manipulation library
- EJS: Embedded JavaScript templating
- ExcelJS: Excel file generation
- Ioredis: Redis client
- Nanoid: Unique ID generator
- Nodemailer: Email sending

### Email Services

- Mailgun
- SendGrid
- Mailchimp

### Payment Integration

- Paystack

## Development Dependencies

- TypeScript and related tools (ts-patch, tsconfig-paths, typescript-transform-paths)
- Nodemon: For auto-restarting the server during development
- Copyfiles: For copying non-TypeScript files to the dist folder

## License

This project is licensed under the ISC License.

## Author

[Your Name/Organization]

---

For more detailed information about each dependency and how to use them, please refer to their respective documentation.