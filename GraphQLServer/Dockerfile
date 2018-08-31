FROM node

WORKDIR /Bolbeck/code

RUN npm install -g nodemon@1.18.3
RUN npm install graphql-yoga
RUN npm install mocha
RUN npm install chai

COPY package.json /Bolbeck/code
RUN npm install && npm ls


COPY . /Bolbeck/code

CMD ["npm","start"]
