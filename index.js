const express = require('express');
const app = express();
const mime = require('mime');

app.use(express.static(__dirname + '/public', {
  setHeaders: async (res, path) => {
    if (path.endsWith('.html')) {
        // Import mime dynamically
        const { lookup } = await import('mime');
        res.setHeader('Content-Type', lookup(path));
    }
}
}));
const axios = require('axios');

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
  try {
      let searchQuery = req.query.q || ''; // Get the search query from the request query parameters
      const options = {
          method: 'GET',
          url: 'https://tasty.p.rapidapi.com/recipes/list',
          params: {
              from: '0',
              size: '20',
              tags: 'under_30_minutes',
              q: searchQuery // Include the search query in the API request
          },
          headers: {
              'X-RapidAPI-Key': '6202324d62msh19baa95b62cbbb3p172668jsnee482b887dbd',
              'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
          }
      };

      const response = await axios.request(options);

      if (response.data) {
          const data = response.data; // Data received from the API
          // Pass data to the EJS template for rendering
          res.render('home', { data: data, searchQuery: searchQuery }); // Pass search query to the template
      } else {
          console.error('API response did not contain data');
          res.status(500).send('API response did not contain data');
      }
  } catch (error) {
      console.error('Error fetching API:', error);
      res.status(500).send('An error occurred while fetching data from the API');
  }
});
// Define a route for displaying recipe details
app.get('/recipe/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const options = {
            method: 'GET',
            url: `https://tasty.p.rapidapi.com/recipes/get-more-info?id=${recipeId}`,
            headers: {
                'X-RapidAPI-Key': '6202324d62msh19baa95b62cbbb3p172668jsnee482b887dbd',
                'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
console.log(response.data); // Log the API response


        if (response.data) {
            const recipe = response.data; 
            
            res.render('recipe', { recipe: recipe });
        } else {
            console.error('API response did not contain data');
            res.status(500).send('API response did not contain data');
        }
    } catch (error) {
        console.error('Error fetching API:', error);
        res.status(500).send('An error occurred while fetching data from the API');
    }
});

  




const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
