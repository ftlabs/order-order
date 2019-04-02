```
{
  "keySchema": {                      // id for row when using DynamoDB
    "order": 0,                       // unique order for debates in a series
    "seriesId": 0                     // unique id for a series of debates
  },
  "type": "name",                     // what kind of debate it is structured, interview, hats etc
  "permitted": {                      // user list of allowed user permissions
    "commenters": [0, 1, 2],          // users allowed to comment, defaults to all
    "replies": [0, 1, 2],             // users allowed to reply to comments, defaults to all
    "voters": [0, 1, 2]               // users allowed to vote (on the debate and individual comments), defaults to all
  },
  "restricted": {                     // user list of restricted user permissions
    "commenters": [0, 1, 2],          // users restricted from commenting, defaults to none
    "replies": [0, 1, 2],             // users restricted from replying to comments, defaults to none
    "voters": [0, 1, 2]               // users restricted from voting (on the debate and individual comments), defaults to none
  },
  "starter": {                        // info to display at the beginning of the debate
    "title": "title",                 // title of the debate
    "description": "description"      // description of the debate
  },
  "comments": [                       // list of all comments for this debate
    {
      "id": 0,                        // unique id
      "userId": 0,                    // id of the commenting user
      "content": "Lorem ipsum",       // the actual comment content
      "audio": "url",                 // any audio/translation for the content (optional)
      "video": "url",                 // any video for the comment (optional)
      "tags": [                       // tags that can denote where/how to display
        "Red",
        "Blue",
        "For",
        "Against",
        "Etc"
      ],
      "ratings": [                    // any ratings positive/negative
        {
          "userId": 0,                // id of the user who commented
          "rating": 0                 // the quality of the rating
        }
      ],
      "replyTo": 0,                   // the id of the comment this comment was replying to (0 if it's an original comment)
      "createdOn": "datetimestamp",   // datetimestamp that the comment was created on
      "updatedOn": "datetimestamp"    // datetimestamp for when this comment was edited/updated
    }
  ],
  "specialUsers": [                   // any addtional user roles i.e. moderators, captains
    {
      "userId": 0,                    // the id of the user with the special role
      "type": "teamA"                 // the name of the special role - teamA, moderator, teamACaptain, etc
    }
  ],
  "state": {                          // additional conditions/variables for the debate
    "open": 0,                        // is the debate open/closed for interaction
    "votable": 0                      // is the debate open for voting
  },
  "teams": [                          // details for any teams taking part in the debate
    {
      "teamName": "Team A",           // name of the team
      "scores": [                     // any scores/ratings attributed to the team
        {
          "userId": 0,                // id of the user giving the score
          "score": 0                  // value/quantity of the score
        }
      ],
      "members": [                    // users that are part of this team
        {
          "userId": 0                 // id of user on the team
        }
      ]
    }
  ],
  "votes": [                          // votes for the debate as a whole
    {
      "userId": 0,                    // id if the user voting
      "score": 0                      // value/quantity of the score/vote
    }
  ],
  "createdOn": "datetimestamp",       // datetimestamp that the comment was created on
  "updatedOn": "datetimestamp"        // datetimestamp for when this comment was edited/updated
}
```
