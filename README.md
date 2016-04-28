# alain-as-a-service

> The official REST API for [alain](https://github.com/sergile/alain)

Get magical product names from this ~~convoluted~~ simple REST API!

Will eventually be accessible here: http://alainasaservice.com

## API

The API is versioned by URL. Currently there's only one version, and it's ~~a bit odd~~ awesome.

JSON is the default medium, but content negotiation ~~will~~ may work.

### GET /v1

Get some product names!

Returns an array of strings by default, but the response structure changes based on the request.

#### Query Params

- `e`, `exactly`: integer

    Generate exactly this many product names. If a value of `1` is given, the response structure will be a single string or object (see `object` param below) instead of an array. `¯\_(ツ)_/¯`

- `n`, `min`: integer

    Generate at least this many product names.

- `x`, `max`: integer

    Generate at most this many product names.

- `j`, `join`: string

    Join the array of generated product names into a single string using this value as the delimiter. Response structure will be a string.

- `o`, `object`: any

   If any truthy value is given, returns an object for each product name instead of a string. Product name objects will have a `left` and `right` property. If `exactly=1` is also given, the response structure will be a single object instead of an array of objects.

### GET /

Currently redirects to `/v1`.

## Running the Server

Requires Node 4+. Clone this repo and install dependencies with `npm i`.

Run and stop the server in the foreground with `npm start` and <kbd>ctrl</kbd>+<kbd>c</kbd>.

Run and stop the server in the background with `npm run forever` and `npm run halt`.

Binds to port 8080.

"Application" logging goes to stdout and is unstructured.

"Audit" logging goes to `log/audit.log` (with file rotation) and is JSON. You could use [`hewer`](https://github.com/brad-bowie/hewer) to aggregate metrics from this log.

## License

ISC © Contributors
