import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from ".";

async function main(){
    console.log(">>> Starting Migration...")
    await migrate(db,{migrationsFolder: 'drizzle'})
    console.log(">>> Migration Completed!")
    process.exit(0)
    
}

main().catch(console.error)