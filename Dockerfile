FROM ubuntu:14.04

RUN apt-get -qq update

# Ubuntu 14.04's nodejs is v0.10, way too old.
# Use this PPA to get nodejs v4.x.
RUN apt-get install -y -qq curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -

RUN apt-get install -y -qq nodejs
RUN apt-get install -y -qq git
RUN npm install -g grunt-cli
RUN npm install -g bower

# Run everything as the "node" user instead of root.
RUN useradd -m node
USER node

# NPM/bower package cache
# We use this so we can do npm/bower install & cache the results.
# You'll need to rebuild image when you change npm/bower packages, otherwise you can just re-run.

RUN mkdir -p /home/node/cache

COPY .bowerrc /home/node/cache/
COPY bower.json /home/node/cache/
COPY package.json /home/node/cache/

RUN mkdir -p /home/node/cache/node_modules
RUN mkdir -p /home/node/cache/client/bower_components

RUN cd /home/node/cache && npm install

# ...

RUN mkdir -p /home/node/koe/node_modules
RUN mkdir -p /home/node/koe/client/bower_components
VOLUME /home/node/koe/node_modules /home/node/koe/client/bower_components

WORKDIR /home/node/koe

EXPOSE 9001

#CMD cp -r /home/node/cache/node_modules /home/node/koe/ && cp -r /home/node/cache/client/bower_components /home/node/koe/client/ && bash
CMD cp -r /home/node/cache/node_modules /home/node/koe/ && cp -r /home/node/cache/client/bower_components /home/node/koe/client/ && grunt --no-open
