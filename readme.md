# Salafi Directory API

Backend API for Salafi Directory application, which is a Salafi source only, directory website. Intended to provide a central point of resource from Salafi organisation's only.

- Salafi only resources
- Scholar's infos
- Student's of knowledge infos
- Classes or conference platform/time's/locations
- Centre infos
- Store infos
- Hajj/Ummrah organisations infos
- Charity organisations infos
- Browser notifcation's

## Intended usage of API externally

> Salafi organisations and developer's will be able to access by requesting their ip addresses to be added.

- If this API is to be used on a external website, you will need permission for access to API end point's. You will only be able to request information, which is publicly available on our website.

- Publisher: Make account for one organisation each, create, read, update and delete the following...

  - One account each organisation
  - Multiple admin's for management
  - All organisation data

- Admin: create, read, update and delete the following...

  - All data except organisation details

- Version 1.0.0
- License MIT

## API Specifications

> Backend specification's below for a Salafi directory API.

### Organanisations

- List all organisations based on type of organisation in the database
  - Pagination
  - Select specific fields in result
  - Limit number of results
  - Filter by fields
  - Use a geocoder to get exact location and coords from a single address field
- Get single organisation
- Create new organisation
  - Authenticated users only
  - Must have the role "publisher"
  - Only one account per organisation
  - Field validation via Mongoose
- Upload a logo for organisation
  - Publisher only
  - logo will be uploaded to local filesystem
- Update organisation
  - Publisher only
  - Validation on update
- Delete organisation
  - Publisher only

## Centre Related

### Classes

- List all classes
- List all classes for centre
  - Pagination, filtering, times, timezones etc
- Get single class
- Create new class
  - Authenticated users only
  - Must have the role "publisher" or "admin"
  - Only the owner or an admin can create classes
- Update classes
  - Publisher or admin
- Delete class
  - Publisher or admin

### Lectures

- List all lectures
- List all lectures for centre
  - Pagination, filtering, times, timezones etc
- Get single lecture
- Create new lecture
  - Authenticated users only
  - Must have the role "publisher" or "admin"
  - Only the owner or an admin can create lectures
- Update lectures
  - Publisher or admin
- Delete lecture
  - Publisher or admin

### Users & Authentication

- Authentication using JSON Web Token or cookies
  - JWT and cookie should expire in 30 days
- User registration
  - Register as a "admin" or "publisher"
  - Once registered, a token will be sent along with a cookie (token = xxx)
  - Passwords will be hashed
- User login
  - User can login with email and password
  - Plain text password will compare with stored hashed password
  - Once logged in, a token will be sent along with a cookie (token = xxx)
- User logout
  - Cookie will be sent to set token = none
- Get user
  - Route to get the currently logged in user (via token)
- Password reset (lost password)
  - User can request to reset password
  - A hashed token will be emailed to the users registered email address
  - A put request can be made to the generated url to reset password
  - The token will expire after 10 minutes
- Update admin or publisher user info
  - Authenticated user only
  - Separate route to update password

## Security

- Encrypted passwords and reset tokens
- Prevented NoSQL injections
- Added headers for security (helmet)
- Prevented cross site scripting - XSS
- Added rate limit for requests of 100 requests per 10 minutes
- Protected against http param polution
- Used cors to make API public (for now)
- SSL encryption
- Enabled firewall (ufw) and open needed ports

## Documentation

- Postman documentation
- Docgen HTML files from Postman
- HTML files as the / route for the api

