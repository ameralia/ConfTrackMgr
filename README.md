# Development requirements
- `node` with `npm`
- cli tool `sass` (can be installed from npmjs.com registry using `npm i -g sass`)
- cli tool `webpack` (can be installed from npmjs.com registry using `npm i -g webpack`)

# Build
- `sass sass/:css/`
- `webpack --no-watch`

# Deployment
This is essentially a static web page that requires just these files
- `index.html`
- `css/style.css`
- `js/bundle.js`

# Usage
Web page has one main multiline text input box where the user may enter the list of talks.
The expected input data format is the same as it was described in assesment.
Clicking on "Enter" button triggers javasript logic that tries to find the first talks distribution among session that satisfies the rules.
In case of wrong input data or if there is no solution then the script reports "Data input error!".
In case of success the script will print out the schedule.
