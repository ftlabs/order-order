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

## Future Features/PRs

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
