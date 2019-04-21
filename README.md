# Employee Recognition Portal

## Quick Start

1. git clone the repository
2. Open the directory containing the repository and run `npm install` to install the dependencies
3. Copy secret_info.json.template (in the config folder) into a file called secret_info.json
  * You need to provide valid credentials in the osu_email fields in order to be able to use OSU SMTP servers, you also need to run it from a machine that's on OSU's network (e.g. a FLIP server or a machine VPN'd to OSU)
  * You can ignore the plotly stuff ***TODO: discuss plotting mechanism***
  * Pick a port number for your server to run on
4. Run `node server.js` to fire up the server

## Endpoints to visit

Keep in mind that all of these endpoints need to be prepended with your hostname and port number defined in secret_info.json ***TODO: talk about port confiugration for the app***
* /login
* /user_page
* /plotlyTest
* /emailTest
* /admin_page
