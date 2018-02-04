# Note Keep API

JWT based authorization pre-set using Passport.

Requires a config.js file to be created locally (git-ignored), that contains secret string for JWT and database URL:

```
const config = { 
    secret: 'your secret string',
    databaseURL: 'address'
}
    
```