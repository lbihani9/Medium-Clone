# Medium Clone

This is an Express and NodeJS based backend implementation of the [RealWorldAPI](https://github.com/gothinkster/realworld/tree/master/api) Spec.

## Running the app
To run locally, run `npm install`, then `npm start`

Once the app is running locally, you can access the API at `http://localhost:3232/`

## Endpoints:

### Authentication:

`POST /api/users/login`

Example request body:
```JSON
{
  "user":{
    "email": "Your email id",
    "password": "keep it a secret"
  }
}
```

Required fields: `email`, `password`

### Registration:

`POST /api/users`

Example request body:
```JSON
{
  "user":{
    "username": "username",
    "email": "email",
    "password": "password"
  }
}
```

Required fields: `email`, `username`, `password`


### Get Current User

`GET /api/user`

Authentication required, returns a [User](#users-for-authentication) that's the current user


### Update User

`PUT /api/user`

Example request body:
```JSON
{
  "user":{
    "email": "email",
    "bio": "bio",
    "image": "path to image"
  }
}
```

Authentication required, returns the [User](#users-for-authentication)


Accepted fields: `email`, `username`, `password`, `image`, `bio`

### Get Article

`GET /api/articles/:slug`

Authentication required, will return [single article](#single-article)

### Create Article

`POST /api/articles`

Example request body:

```JSON
{
  "article": {
    "title": "Here goes your title",
    "description": "Here goes your description",
    "body": "body",
  }
}
```

Authentication required, will return an [Article](#single-article)

### Delete Article

`DELETE /api/articles/:slug`

Authentication required


### Add Comments to an Article

`POST /api/articles/:slug/comments`

Example request body:

```JSON
{
  "comment": {
    "body": "comment"
  }
}
```

Authentication required, returns the created [Comment](#single-comment)

Required field: `body`

### Get Comments from an Article

`GET /api/articles/:slug/comments/:id`

Authentication optional

### Delete Comment

`DELETE /api/articles/:slug/comments/:id`

Authentication required

### Get Profile

`GET /api/profiles/:username`

Authentication required, returns a [Profile](#profile)

### Follow user

`POST /api/profiles/:username/follow`

Authentication required, returns a [Profile](#profile)

### Unfollow user

`DELETE /api/profiles/:username/follow`

Authentication required, returns a [Profile](#profile)
