# order-order

A swiss army knife of various forms of structured comments.

## Setup

```
cp .env_example .env
npm install
```

## Running

```
node index.js
```

...or `nodemon index.js` if you have nodemon installed globally

Go to [http://localhost:PORT](http://localhost:PORT)

### Admin

You can get to the skeleton admin page here:
[http://localhost:PORT/admin](http://localhost:PORT/admin)

![Alt text](./docs/admin_examle.png?raw=true "Example of how the admin currently looks")

## Questions

- Do we need to track which user created the debate?

## MVP

- origami-ify
- create a debate
  - edit debate
- user can view debate
- user can create for/against comments
- users can reply to comments
- users can flag a comment
- admins can review reports
- admins can ban/hide/ignore comment that was reported
