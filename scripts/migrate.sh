#!/bin/bash

npx drizzle-kit generate:pg --schema=./database/schema.ts && node -r esbuild-register database/migrate.ts