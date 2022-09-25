# Interesting Notes

## Covalent Related
[https://www.covalenthq.com/docs/api/#/0/0/USD/1]

Covalent API request for realtime have a 2 blocks lag

On Polygon where block takes 3 seconds to be mine, it will take 6 seconds to get the data.
On Ethereum mainnet its, 15 seconds per block so it's 30 sedconds to get the data.

Batched endpoint requests on the other hand has a 30 minutes delay.

Rate limit is 5 requests per second.

## Wallet Linking

- Alexa tells user that the amazon account has not been linked yet to a wallet
- Sends user id to Server
- Server generates six digit code and store user id and code in cache
- Gives user the 6 digit code and ask user to go to a particular url within 60 mins or so (future can probably just email the user the link to go to so there is no need for user to remember the 6 digit code (can even be longer code etc)
- On server side the user put in the link code the ENS eth address or login to connect their wallet
- Server will link the address to the user id



