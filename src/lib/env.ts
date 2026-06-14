if (!process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = "postgres://postgres:postgres@localhost:5432/portfolio";
}
export {};
