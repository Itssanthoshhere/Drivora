# Prisma Setup & Workflow

### 1. Install Dependencies
Install Prisma CLI as a dev dependency and the Prisma Client:
```bash
npm install prisma @prisma/client
```

### 2. Initialize Prisma
Create the initial Prisma setup, which includes the `schema.prisma` file:
```bash
npx prisma init
```

### 3. Run Migrations
Apply your schema changes to the database and keep the migration history. This uses your custom configuration:
```bash
npx prisma migrate dev --name init --config prisma.config.ts
```

### 4. Generate Prisma Client
Update the Prisma Client code based on your latest schema:
```bash
npx prisma generate
```

### 5. Open Prisma Studio
Launch the visual database editor to view and edit your data:
```bash
npx prisma studio
```
