## UNDERSTANDING HOW IT WORKS:
### CLI
We generate a local fake DB with the CLI-tools subproject.
It uses the node fs streams to generate the CSV file row by row in an async way based on events while the csv generator writes each row in a buffer.

### API
Next we start the API which listen on 2 routes, the requests (only GET) pass by 4 middlewares.
The 2 models are designed following the singleton pattern.
For the locations, the API fetch data from CSV file at the start of the server in an async way, which can lead to errors or blank results if an user triggers requests before end of fetching.
the CSV file is read synchronously but the init method of model is async so the app doesn't wait the end of CSV reading to continue its starting but the model's init waits the end of CSV reading.
For the postal codes, the API try to fetch data from external API sources, extract and format the data to a consistent set.
According to the cors middleware, the requests/responses between our API and the external ones like Laposte are authorized but the policy is to permissive, not secure at all.
In case of error, from external API or internal functions, the errors seems to be managed, logged and sent back to the client with the middleware `handle-errors.js`.

### Client
The front-end have react components written in class mode and with internal state wich stores data from API before displaying it in table.
Client side there is no validation step on data submitted to API but we check props types on the API's return.
If an error occurs while fetching data from the API, the client don't crash but no information is given to the user.

## PERSONNAL SUBJECTIVE OPINION
### POSITIVE REMARKS OR BEST PRACTICES :
- Fixed dependencies versions in package.json
- linting, prettier
- clear architecture, isolated services
- discover yargs, nice tool !
- emojis in logs 💪
- Use of a logging lib
- API errors are managed, at least catched and logged. 
- Functions are old style ES5 (as opposed to ES6 arrow functions), this is the only way to name functions and keep a track in the debugger.
- Globally the code is pleasant to read. Modern, clear and airy, no callback hell or pyramid of doom. It seems intentionally written for humans and is therefore easier to maintain.
- functions and variables names are meaningful
- functions throw errors at the begining to avoid code interpretation if it can't be executed. Safe and ressource-friendly.
- Semantic UI, nice! FYI since the framework looked abandoned, the community created a fork [Fomantic UI](https://github.com/fomantic/Fomantic-UI)

### AMELIORATION POINTS :
- yarn instead of npm. If no advanced Yarn feature is used like workspaces, I would have chosen npm because it does the same job, just as fast as yarn and comes with node by default.
- Backend apps (cli-tools and api) uses ES Modules directly in node without babel transpilling, so the node version >=12 should be specified in it's package.json. This is not safe for production mode as NodeJS developpers warn that it is still an experimental feature.
- Projects document a `yarn test` command but there is no tests. It should have been mentioned in the README.md like "tests are under development"
- API routes are not secure, the query is not even escaped. Too much trust in the client.
- There are ESLINT rules bypassed, solutions can be found sometimes to avoid that.
- API models are classes not functions
- The lib filter-by-reg-exp.js uses lodash for native reduce and filter functions, it may have been avoided. Lodash is usefull for all other methods non covered by ES implementation like `_.groupBy()` and lodash sequential chaining : `_(myObj).filter().sort()`
- sometimes a function is defined and used just once, in the same module. It could be considered as a bad practice but is also usefull so it depends of the team you are.
- Create-react-app without ejecting. It kickstarts a project at lightning speed but obfuscate too much important config files that I like to tweak or at least to read.
- The memory leak in API made my linux subsystem for windows badly crash!