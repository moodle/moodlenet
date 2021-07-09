FROM node:15.8-alpine3.10

# https://github.com/softwaremagico/node-sharp/blob/master/Dockerfile
# Compile Vips 
RUN	apk --no-cache add libpng librsvg libgsf giflib libjpeg-turbo musl \
  && apk add vips-dev fftw-dev build-base --update-cache  --repository https://alpine.global.ssl.fastly.net/alpine/edge/testing/  --repository https://alpine.global.ssl.fastly.net/alpine/edge/main \
  && apk --no-cache add --virtual .build-dependencies g++ make python curl tar gtk-doc gobject-introspection expat-dev glib-dev libpng-dev libjpeg-turbo-dev giflib-dev librsvg-dev  \
  && apk del .build-dependencies

COPY --chown=node ./ ./moodlenet
USER node
WORKDIR /moodlenet
# RUN npm config set unsafe-perm true
# RUN yarn config set unsafe-perm true

RUN yarn
RUN yarn bs  
RUN yarn build
COPY .env packages/backend/.env
EXPOSE 3000 8080
CMD ["yarn", "start"]
