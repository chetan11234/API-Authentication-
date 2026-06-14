import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";


const yourUsername = "cheetahikehde";
const yourPassword = "kehdehucheeta";
let yourAPIKey = "e4b09ac5-9065-45e3-8fb3-07e1af26ea77";
let yourBearerToken = "a9b04f8a-ba15-40a1-82db-287545c6e2a5";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}random`);
    res.render("index.ejs", { content: JSON.stringify(response.data) });
  } catch (error) {
    console.log(`This error happens : ${error.message}`);
    res.render("index.ejs", { content: error.message });
  }
});

app.get("/basicAuth", async (req, res) => {
  try {
    const response = await axios({
      url: 'all?page=1',
      method: 'get', // default
      baseURL: `${API_URL}`,
      auth: {
        username: `${yourUsername}`,
        password: `${yourPassword}`
      }
    }
    );
    res.render("index.ejs", { content: JSON.stringify(response.data) });
  } catch (error) {
    console.log(`This error happens : ${error.message}`);
    res.render("index.ejs", { content: error.message });
  }
});

app.get("/apiKey", async (req, res) => {

  try {
    const response = await axios({
      url: "generate-api-key",
      baseURL: `${API_URL}`,
      method: "get"
    });
    console.log(`ApiKey Generated : ${response.data.apiKey}`);
    yourAPIKey = response.data.apiKey;
  } catch (error) {
    console.log(`Error in generating apiKey: ${error.message}`);
  }
  try {
    const response = await axios({
      url: "filter",
      method: 'get',
      baseURL: `${API_URL}`,
      params: {

        apiKey: `${yourAPIKey}`,
        score: 6

      }
    });
    res.render("index.ejs", { content: JSON.stringify(response.data) });
  } catch (error) {
    console.log(`Error in fetching the activity : ${error.message}`);
  }
});

app.get("/bearerToken", async (req, res) => {

  try {
    const response = await axios({
      method: 'post',
      url: 'get-auth-token',
      baseURL: `${API_URL}`,
      data: {
        username: `${yourUsername}`,
        password: `${yourPassword}`,
      }
    });
    yourBearerToken = response.data.token;
    console.log(`Your token generated is : ${yourBearerToken}`);
  } catch (error) {
    console.log(`Error in fetching the token : ${error.message}`);
  }
  try {
    const response = await axios({
      method: "get",
      url: 'secrets/1',
      baseURL: `${API_URL}`,

      headers: { Authorization: `Bearer ${yourBearerToken}` }
    });
    res.render("index.ejs", { content: JSON.stringify(response.data) });
  } catch (error) {
    console.log(`Error in fetching the activity by token : ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
