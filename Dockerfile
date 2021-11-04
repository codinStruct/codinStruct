FROM ubuntu

WORKDIR /usr/src/codinStruct
COPY package*.json ./
COPY . .
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install -y sass
RUN pip3 install -r Projeto-MDtoHTML/requirements.txt
EXPOSE 80
CMD ["npm","start"]