const {app, express} = require("./app");
const {productsRouter} = require("./routes/products.routes");
const {authRouter} = require("./routes/auth.routes");
const port = 3000;
const helmet = require("helmet");

// Connection to database
require("./mongo");

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "same-site" }
}));
app.use("/api/sauces", productsRouter);
app.use("/api/auth", authRouter)

// Routes

app.get("/", (req, res) => res.send("coucou !"));

// Listen
app.use("/images", express.static("images"));
app.listen(port, () => console.log("Listening port: " + port));