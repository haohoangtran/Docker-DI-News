FROM node:12.13
# Create app directory
WORKDIR .
# Bundle app src
COPY . .
# Install app dependencies
RUN npm install
EXPOSE 3002
CMD [ "npm", "start" ]