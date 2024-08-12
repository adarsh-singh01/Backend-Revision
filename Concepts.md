# HTTP

diff b/w http and https is that in https the data travels by being unreadable during the transfer


URL-locator
URI-identifier
URN-name

http have headers also as metaData-->key balue pairs sent along with request and response

headers are used for caching,authenticatiom,manage state

eariler headers key use to be named like (x-name)..now its deprecatted

### types of headers (not official)
- request header-->from client
- response header-->from server
- representation headers-->encoding/compression
- payload headers-->data

### Most Common headers
- Accept-->kesa data expect krta h (application/json)
- User-Agent-->isse pta chlta ki kaha se request aaayi hai (kis device se phone,laptop,postman etc)
- Authorization-->Bearer token wagera
- content-type
- cookie
- Cache-control

### CORS Headers
- ACCESS-CONTROL-ALLOW-ORIGIN
- ACCESS-CONTROL-ALLOW-CREDENTIALS
- ACCESS-CONTROL-ALLOW-METHOD

## Security Headers
- CROSS-ORIGIN-EMBEDDER-POLICY
- CROSS-ORIGIN-OPENER-POLICY
- CONTENT-SECURITY-POLICY
- X-XSS-PROTECTION

## HTTP METHODS
- GET
- HEAD
- OPTIONS
- TRACE
- DELETE
- PUT
- POST
- PATCH

## HTTP STATUS CODE
 
 These r standards ...u can send data with 404 also
- 1XX informational
- 2xx success
- 3xx redirection
- 4xx client error
- 5xx server error