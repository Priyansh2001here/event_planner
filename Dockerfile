# pull official base image
FROM python:3-buster

# set work directory
WORKDIR /usr/src/app

#RUN apk --update add libxml2-dev libxslt-dev libffi-dev gcc musl-dev libgcc openssl-dev curl
#RUN apk add jpeg-dev zlib-dev freetype-dev lcms2-dev openjpeg-dev tiff-dev tk-dev tcl-dev
#RUN apk update \
#    && apk add postgresql-dev gcc python3-dev musl-dev
#
#RUN echo "http://dl-8.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories
#RUN ln -s /usr/include/locale.h /usr/include/xlocale.h



# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt
# copy project
COPY . .

# run entrypoint.sh
#CMD ["python", "manage.py", "runserver"]