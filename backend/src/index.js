import express from "express";
import cors from "cors";
import { Postgres } from "./database/postgres.js";
import { config } from "dotenv";
import authRouter from "./auth/auth.js";
import usersRouter from "./routes/users.js";
import cashRouter from "./routes/cash.js";
import ingredientsRouter from "./routes/ingredients.js";
import platesRouter from "./routes/plates.js";
import ordersRouter from "./routes/orders.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

config()

async function main () {
    const hostname = 'localhost';
   const port = process.env.PORT || 3000;
// ...
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

    const app = express();

    await Postgres.connect({
        connectionString: process.env.DATABASE_URL
    });

    app.use(express.json());
    app.use(cors());

    app.use('/auth', authRouter);
    app.use('/users', usersRouter);
    app.use('/api/cash', cashRouter);
    app.use('/api/ingredients', ingredientsRouter);
    app.use(express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend')));
    app.use('/plates', platesRouter);
    app.use('/orders', ordersRouter);

    app.get('/', (req, res) => {
        res.send({
            success: true,
            statusCode: 200,
            body: 'Bem vindo a Aliados Burguer'
        });
    });

    app.use((error, req, res, next) => {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Ocorreu um erro interno. Tente novamente.'
        });
    });

    app.listen(port,()=>{
        console.log(`Server running on http://${hostname}:${port}`)
    })
}

main().catch((error) => {
    console.error('Não foi possível iniciar o servidor:', error);
    process.exitCode = 1;
});