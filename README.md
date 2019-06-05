# order-order

A swiss army knife of various forms of structured comments/debates.

## Setup

```
cp .env_example .env
npm install
```

## Running

`npm start`, and in a separat tab `npm run watch-css`, to automatically compile changes to Sass files to CSS.

Go to [http://localhost:PORT](http://localhost:PORT)

### Admin

You can get to the skeleton admin page here:
[http://localhost:PORT/admin](http://localhost:PORT/admin)

![Alt text](./docs/admin_examle.png?raw=true 'Example of how the admin currently looks')

## Adding a new debate type

When you add a new debate type you will also need to add the corresponding logic and view so the app knows how to handle the specific debate type. Here is a quick setup guide to what you need to do.

1. Firstly in the `modules` folder in the root add a javascript file with the name of your debate type all in lowercase. e.g `foragainst.js`.

2. In this file all you need to add is a function called display which takes three params `req`, `res` and `data` and ends with `res.render(data.type, data);`. You can manipulate the data object however you like for your specific debate. This is a basic example:

```
function display(req, res, data) {
	res.render(data.type, data);
}
module.exports = { display };
```

3. Next you need to create the view. In `views/debates` add a handlebars with the name of your debate type e.g `foragainst.hbs`. This is a basic example:

```
{{#> head title='Example' subtitle='Example' type='example' }}
{{/head}}

<body>
    {{> user/header username=user.usernameNice }}

    {{> components/heading/topper debateType=debateType title=title description=description }}

    <main class="o-grid-container">
        <p>
            Do whatever you want here
        </p>
    </main>
</body>
{{> footer type='example' }}
```

4. If you want to add client side javascript. In `static/js/debates` create a folder named after your debate type. As long as you have `{{> footer type=<name of debate type> }}` in your view your javascript file will be available.

5. If you want to add styling. In `sass/debates` create a file named after your debate type. Then in `sass/main.scss` add `@import 'debates/<name of debate type>'` below the other debate types.

## Future Features/PRs

-   _Mobile friendly_
    -   Update the admin and client views to be mobile friendly
-   _Git hook for Prettier_
    -   To enforce Prettier styling for those on the project without the prettier plugin
-   _Moderation_
    -   Allow users to report a comment
    -   Allow admins to action or ignore the report
        -   Actions could include:
            -   hiding the content
            -   removing the content
            -   supsending the user
            -   banning the user from the platform
-   _Dynamic Page Load_
    -   Rather than refreshing the page for user after they comment we could use soemthing like Socket.io to update the users view dynmically when new posts are avaialble
-   _Splunk drain for error logs (and events)_
    -   Central location for storing error logs
    -   Could also store events (new debate created, debate voting open, debate deleted etc) for later GUI display for super admins
-   _Debate type file creation_
    -   Since there is a useful debate type creation GUI it would be very handy to have the required files generated as well, to give the dev somewhere to start
    -   Perhaps from templates?
-   _Delete/Archive debates_
    -   We don't want to truly delete any debate content (may be needed for reference later)
    -   But an admin may have made a mistake so needs to hide the debate from everyones view
    -   Or, in the extreme, allow super admin to fully delete an archived debate
    -   Debates that have finished are CLOSED not ARCHIVED
    -   Super Admins show be able to see:
        -   List of archived debates
        -   Event logs of deleted debates
-   _Admins & Super Admins_
    -   Tools for Super Admins to manage admins
        -   Suspend/Delete admin
        -   Re-assign deleted admins content to another admin
        -   Add/remove admin permissions on different debates
-   _Debate scheduling_
    -   Set date/time for debate to open or close
    -   Set date/time for debate's voting to open or close
-   _Debate/Debate type edit version history_
    -   admin changing the details of the debate/debateType - admin opening/closing the debate/voting
-   _Tagging an special user delete specific field rather than just the last one_
    -   When you remove or add tags it onl removes the last one which is annoying if you had lots of special users or tags and didnt want to type them all out again.

## Questions
