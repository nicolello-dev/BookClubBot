Points System: Setting it up.
An !add/remove to/from [user] command.
A !buy <item name> command. (No actual shop items. item is the arg after the command. ALWAYS cost 150 points).
An !inventory command to list bought items.

!Profile command replies with an embed that lists:
Users Current Balance/Points, Currently Reading Books, incl. the author and progress (% form) for each book, and Favorite Books incl. the author.
Attached to the embed are three button options to open more profile details.
Points Log Button: List all points received and reasons (Like A User Points Log).
Read Button: List books, the author, and the users ratings marked as Read.
TBR Button: List books and the author marked To be Read.
!edit command. Edit any of above except balance and points log. (allowing to remove books mainly).

Book Lookup: !book [Author] uses the Google books API to search for said book and send the data in an embed.
(If possible, would like to dictate which book data displays in the Embed ex. would like page # and author, but not really interested in the publishing year or the description of the book).
ALSO, attach buttons under each book embed to mark as:
Currently Reading
Favorite
To Be Read
Read.
(Clicking any of the buttons will add the book to the corresponding list on the profile.)
Other Commands: !add/remove <Current, Favorite, TBR, Read>. Adds the Title and Author to the corresponding list in case the API can't find it.
!rate <book title> adds rating to the Read book mentioned.
!prog <current page #> <total pages> . Will add progress to currently reading books, preferably shown as a percentage for the difference between the two.

Sprints: Reading sprints that tie into the points.
!sprint for <time to sprint, in minutes> starting in [delay before starting timer] command. Starts a timer for the designated amount of time (max of at least 120 minutes) to start after the delay. Replies with a message saying "A sprint for x minutes will start in y minutes". Once the delay is up a "start reading" message is sent.
After the sprint timer ends, another message is sent saying Sprint is over and you have 5 minutes to get in your final pages, joined users are tagged.
After the 5 minutes OR after all users that joined have entered their final numbers, send a final message listing participants and their total pages read during the sprint. From highest to lowest.
A !join [starting page number] command will sign that user up for the current sprint and remember their starting page number. (Command only available during active sprints).
A !final <ending page number> command sets that amount of pages as their ending page number. (Only Allowed During Sprints AND if the User has joined the current sprint). Automatically add x amount of points to any user who used this command. (amount of points = sprint time in minutes divided by 4, ex. a 60 minute sprint would give 15 points).
Then find the difference between start and finish and use that as total read.
A !sprintstats command would post an embed showing that users total points from sprints, total sprints joined, total time spent in sprints, and total pages read during sprints.
A !cancel command to cancel the sprint. !leave command to leave sprint before it ends.

Buddy Reads: A !br <book title> <Start date> command to create an Embed with the book title and start date on it. Add buttons under to either join or leave that buddy read. (Users that click join will be added/listed to a section of the embed for participants and removed if they click leave).

Challenges: !chal shows an embed of a list of names of the challenges that user has added. !chal <challenge name> shows an embed with details about said challenge.
!chal add/remove <challenge name> adds/removes said reading challenge from users history.
!edit <challenge name> to add details to said challenge. A modal response will pop up with the following sections to fill out: Total number of Prompts/Goals, Completed number of Prompts/Goals, List of Prompts (May be LONG), Location of Challenge.

Other: Want to have a single embed named 5 Star Reads.Then have a !5star <book title> <author> command that will list the title, author, and user that added it to the embed. (Looking for this to happen automatically, without having to go in and edit the embed ourselves.
