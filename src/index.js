const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const pool = require("./database.js");

//inicializaciones
const app = express();

//configuraciones
app.set("port", process.env.PORT || 2231);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", 
  exphbs.engine({
  defaultlauout: "main",
  layoutsDir: path.join(app.get("views"), "layouts"),
  partialDir: path.join(app.get("views"),"partials"),
  extname: ".hbs",
  helpers: require("./helpers/handlebars")
}));

app.set("view engine", ".hbs")

//use app
app.use(express.urlencoded({extended: false})); //sirve para traer desde el formulario los datos que dan los usuarios
app.use(express.json());

//public
app.use(express.static(path.join(__dirname, "public")));

//rutas
app.use(require("./routes/"));

app.use("/finanzas", require("./routes/finanzas/finanzas"));
app.use("/finanzas/registros", require("./routes/finanzas/registros"));
app.use("/finanzas/gastos", require("./routes/finanzas/gastos"));


app.use("/gestion_tiempo", require("./routes/gestion de tiempo/gestion_tiempo"));

// app.use("/objetivos", require("./routes/objetivos_generales"));
// app.use("/objetivos_sub", require("./routes/objetivos_individuales"));
// app.use("/actividad", require("./routes/actividad_general"));
// app.use("/necesidades", require("./routes/necesidades"));


app.listen(app.get("port"),() => {
  console.log('Servidor escuchando en el puerto', app.get("port"));
});