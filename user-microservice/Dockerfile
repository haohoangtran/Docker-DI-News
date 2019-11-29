FROM node:12.13
# Create app directory
WORKDIR /home/thudojsc/WebstormProjects/Demo-Docker/user-microservice
# Bundle app src
COPY . .
# Install app dependencies
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]