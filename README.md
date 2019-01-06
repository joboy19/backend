# backend

Red Thunder backend.

## Running

Google Calendar library requires the `keys/privatekey.json` file. You should
get this off the group chat.

PayPal library requires the `keys/paypal.json` file.

Sending emails require the password to `durhamredthunder2018@gmail.com` to be
stored in the`RED_THUNDER_PASSWORD` environment variable. To do this on Linux:

```sh
$ RED_THUNDER_PASSWORD='...' npm start
```

On Windows:

```
> set RED_THUNDER_PASSWORD=...
> npm start
```
