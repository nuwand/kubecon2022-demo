FROM node:18-alpine
RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /usr/src/app
RUN npm install -g typescript ts-node
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)


# Bundle app source
COPY . .
RUN rm -fr node_modules

RUN npm install
#RUN npx prisma generate

# Set a non-root user
USER 10014

EXPOSE 8080

CMD [ "ts-node", "src/index.ts" ]

