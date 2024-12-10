### How to run Jira Data Center instance locally in Docker

1. run docker compose - `docker-compose up --build -d`
2. run ngrok `ngrok http 8080` and copy `Forwarding` URL and open in browser
3. follow to setup instructions

### Update license

1. go to https://my.atlassian.com/license/evaluation and select Jira -> Jira Software (Data Center)
2. Server ID: Settings -> System info -> Your "Server ID" is listed in the JIRA info section
3. to renew license: Settings -> Applications -> Versions & licenses and there update "License key"
