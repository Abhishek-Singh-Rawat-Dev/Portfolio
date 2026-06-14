import type { NextConfig } from "next";

if (!process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = "postgres://postgres:postgres@localhost:5432/portfolio";
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
