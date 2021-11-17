FROM ubuntu

WORKDIR /usr/src/codinStruct
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN apt-get install -y python3
RUN apt-get install -y python3-pip

COPY package*.json ./
RUN npm install

COPY md2html/requirements.txt md2html/
RUN pip3 install -r md2html/requirements.txt

COPY . .

# Saves the built files to the image so they don't have to be built again
# every time Heroku stops the app because it was idle and has to start it again 
RUN npm run build:prod

CMD ["npm","start"]
