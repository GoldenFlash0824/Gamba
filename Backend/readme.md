on development server
----------------------
01. create database
02. change credential on .env and config/config.json
03. run npm start
04. wait till migrate all file then stop
05. change type from module to commonjs in package.json
06. change credentials on config/config.json
07. cd to src
08. run sequelize db:seed:all --debug 
09. cd back
10. run npm start
11. check server is running by visiting /gamba/user/posts/get_popular_post