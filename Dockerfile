FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY --from=builder /app/dist ./dist

#ENV PORT=3000
#ENV MONGODB_URI=mongodb://localhost:27017/bookstore
#ENV JWT_SECRET=your_jwt_secret_key
#ENV EMAIL_SERVICE=gmail
#ENV EMAIL_USER=geniusai854@gmail.com
#ENV EMAIL_PASS=exffnvlyebdcfqbd
#ENV VERIFICATION_CODE_EXPIRY=3600

EXPOSE 3000

CMD ["npm", "run","start"]