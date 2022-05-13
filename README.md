# ProgImage

### Steps to deploy the app

> ☝️ Make sure you have already installed both [Docker Engine](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).

> ☝️ Create a local .env file and fill appropriately. You can copy the default.env file and override your values.

```bash
# locate the root folder of prog-image project
# run the backend containers
# create a local .env file for docker-compose
$ docker-compose up --build -d

# by now the database and the api container should run
```

If everything went smoothly the swagger api should be running on your specified port localhost:9000


### Changing default ports
> Do these changes if needed before running the above steps
- **REST server:** Change the `PORT` value in `./default.env`
- **DB server:** Change the `PROGIMG_MONGODB_PORT` value in  `./default.env`
