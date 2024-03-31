const express = require("express");
const app = express();
const mime = require("mime");

app.use(
  express.static(__dirname + "/public", {
    setHeaders: async (res, path) => {
      if (path.endsWith(".html")) {
        const { lookup } = await import("mime");
        res.setHeader("Content-Type", lookup(path));
      }
    },
  })
);
const axios = require("axios");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  try {
    let searchQuery = req.query.q || "";
    let currentPage = parseInt(req.query.page) || 1;
    const pageSize = 9;

    const options = {
      method: "GET",
      url: "https://tasty.p.rapidapi.com/recipes/list",
      params: {
        from: (currentPage - 1) * pageSize,
        size: pageSize,
        tags: "under_30_minutes",
        q: searchQuery,
      },
      headers: {
        "X-RapidAPI-Key": "6202324d62msh19baa95b62cbbb3p172668jsnee482b887dbd",
        "X-RapidAPI-Host": "tasty.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);

    if (response.data) {
      const data = response.data;

      const totalPages = Math.ceil(data.total_items / pageSize);

      res.render("home", {
        data: data,
        searchQuery: searchQuery,
        currentPage: currentPage,
        totalPages: totalPages,
      });
    } else {
      console.error("API response did not contain data");
      res.status(500).send("API response did not contain data");
    }
  } catch (error) {
    console.error("Error fetching API:", error);
    res.status(500).send("An error occurred while fetching data from the API");
  }
});

app.get("/recipe/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const options = {
      method: "GET",
      url: `https://tasty.p.rapidapi.com/recipes/get-more-info?id=${recipeId}`,
      headers: {
        "X-RapidAPI-Key": "6202324d62msh19baa95b62cbbb3p172668jsnee482b887dbd",
        "X-RapidAPI-Host": "tasty.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    console.log(response.data);

    if (response.data) {
      const recipe = response.data;

      res.render("recipe", { recipe: recipe });
    } else {
      console.error("API response did not contain data");
      res.status(500).send("API response did not contain data");
    }
  } catch (error) {
    console.error("Error fetching API:", error);
    res.status(500).send("An error occurred while fetching data from the API");
  }
});

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
