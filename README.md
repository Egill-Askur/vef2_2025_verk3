```
npm install
npm run dev
```

```
open http://localhost:3000
```

```
Skjölun:
GET /categories
engin parameters

GET /categories/:slug
skipta út ":slug" með category slug

POST /categories
{
    "title": "string"
}

PATCH /categories/:slug
skipta út ":slug" með category slug
{
    "title": "string"
}

DELETE /categories:/slug
skipta út ":slug" með category slug

GET /questions
engin parameters

GET /question/:slug
skipta út ":slug" með category slug

POST /questions
{
    "desc": "string",
    "categorySlug": "string",
    "questionSlug": "string",
    "svar1": "string",
    "svar2": "string",
    "svar3": "string",
    "svar4": "string",
    "correctAnswer": int
}

PATCH /questions/:slug
skipta út ":slug" með question slug
{
    "itemToChange": value
}

DELETE /question/:slug
skipta út ":slug" með question slug
```