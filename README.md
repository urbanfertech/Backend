
---

## UrbanFur – Backend Setup Guide



### Step 1: Clone the repository

```bash
git clone https://github.com/sohelsheikh05/UrbanFur-backend.git
cd Backend
```

---

### Step 2: Install dependencies

```bash
npm install
```

---

### Step 3: Environment configuration

1. Create a `.env` file in the project root.
2. Copy contents from `.env.example`.
3. Paste the shared credentials provided by the maintainer/Add Credentials of your own.

```bash
cp .env.example .env
```

---

### Step 4: Prisma initialization

1. Generate Prisma client to sync schema.
2. Apply database schema to the connected database.

```bash
npx prisma generate
npx prisma migrate dev
```

If database schema already exists:

```bash
npx prisma db push
```

---

### Step 5: Run the application

```bash
npm run dev
```




