import * as dotenv from "dotenv";
import AppDataSource from "../data-source";

// Explicitly load the test environment
if (process.env.NODE_ENV === "test") {
    dotenv.config({ path: ".env.test" });
} else {
    dotenv.config({ path: ".env" });
}

beforeAll(async () => {
    await AppDataSource.initialize();
});

afterEach(async () => {
    const entities = AppDataSource.entityMetadatas;

    for (const entity of entities) {
        const repository = AppDataSource.getRepository(entity.name);
        await repository.clear();
    }
});

afterAll(async () => {
    await AppDataSource.destroy();
});
