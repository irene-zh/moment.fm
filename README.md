# moment.fm

# building the project
```
npm install -S spotify-web-api-js
cd auth-server
npm install
node authorization_code/app.js
cd ../server
npm install
npm start
cd ../client
npm install
npm start
```

# Code Outline
- auth-server : connects to Spotify API
- client : NodeJS client code, contains all pages and front end style code
- server: NodeJS server code, starts Node server to run webapp locally
- web_scraper: contains code for a Python web scraper that was unsucessful. Times out due to too many Genius API calls :'( 
- data_cleaning: contains code using Python and Pandas used to clean data.

# Developers:
- Eddie Cai
- Felix Cui
- Linda Ting
- Irene Zhang
