import app, { initializeDatabase } from "./app";

const PORT = process.env.PORT || 5000;

initializeDatabase().then(()=> {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.error("Error initializing Data Source:", err);
});
