
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/buscar-propiedades", async (req, res) => {
  try {
    const filtros = req.body;

    const response = await axios.get(
      "https://api.tokkobroker.com/v1/property/",
      {
        headers: {
          Authorization: `Token ${process.env.TOKKO_API_KEY}`
        },
        params: {
          operation_type: filtros.operacion === "venta" ? 1 : 2,
          city: filtros.ciudad || "Rosario",
          bedrooms: filtros.dormitorios || undefined
        }
      }
    );

    const propiedades = response.data.objects.slice(0, 3).map(p => ({
      titulo: p.publication_title,
      precio: p.operations?.[0]?.prices?.[0]?.price || "Consultar",
      zona: p.location?.neighborhood || "",
      link: p.publication_url
    }));

    res.json(propiedades);
  } catch (error) {
    res.json([]);
  }
});

app.listen(3000, () => {
  console.log("Servidor funcionando");
});
