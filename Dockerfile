FROM node:18

RUN apt-get update && \
    apt-get install -y xvfb wget sudo && \
    apt-get install -y default-jre

RUN apt-get install libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libdbus-1-3 libatspi2.0-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libxkbcommon0 libasound2 -y

# Setup e2e tests and dependencies
COPY . /src
WORKDIR /src

RUN npm ci

ENTRYPOINT npm run $RUN_NAME