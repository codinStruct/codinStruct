FROM ubuntu

WORKDIR /usr/src/codinStruct
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install -y git
RUN npm install -g sass

COPY package.json package-lock.json .
RUN npm install

COPY Projeto-MDtoHTML/requirements.txt Projeto-MDtoHTML/
RUN pip3 install -r Projeto-MDtoHTML/requirements.txt

COPY . .
EXPOSE 80
CMD ["npm","start"]
