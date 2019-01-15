# backend

Red Thunder backend.

## Contributing

 - Fork this repository (using the button)
 - Clone your fork
 - Enter these commands in your local fork:

       $ git remote add upstream https://github.com/RedThunder-Durham/backend
       $ git remote -v

   The output of the second command should include the URL.

 - Work on your own fork.
 - Push to your own fork and make a PR.
 - To sync your local fork with the main repository (assuming you're on the
   right branch):

       $ git fetch upstream
       $ git merge upstream/master


## Running

Integration with 3rd party services requires API keys and configuration to be
stored in the `keys` folder. You should get these files off the group chat:

 - Google Calendar `keys/privatekey.json`
 - Gmail `keys/gmail.json`
 - PayPal `keys/paypal.json`

Then you can do:

    $ npm start
