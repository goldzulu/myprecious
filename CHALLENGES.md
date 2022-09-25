# Challenges

## How to get the voice user to give the ethereum address to Alexa

### Problem
Alexa doesn't know the wallet adddress to begin with and if the user needs to say it out, it will be excruciatingly long. Using ENS is an idea but not many people have ENS names and even so, entering ENS names via voice is run the risk of whatever being said not being recognized by Alexa as there are too many possibilities

### Solution
1 - Alexa ask the user to go to a particular website to enter a 6 digit code that Alexa generates. The website would then ask the user to enter an ENS domain name or login with a wallet. The response for either will be captured, stored and link to that 6 digit code so when the next time the user ask for a balance, Alexa will know which wallet to check