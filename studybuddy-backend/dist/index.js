import express from "express";
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send("'API is working 🚀");
});
app.listen(3000, () => { console.log("App running on 3000"); });
//# sourceMappingURL=index.js.map