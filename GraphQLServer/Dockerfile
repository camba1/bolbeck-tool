FROM node

WORKDIR /Bolbeck/code

COPY package.json /Bolbeck/code

RUN npm install -g nodemon@1.18.3
RUN npm install graphql-yoga@1.16.1
RUN npm install mocha
RUN npm install chai

COPY package.json /Bolbeck/code
RUN npm install && npm ls


COPY . /Bolbeck/code

CMD ["npm","start"]
