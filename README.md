# NodeJS Template

A template for NodeJS - includes: logging, middleware, error-handling, multiple env

## Create a self-sign

1. Create a key

```
openssl genrsa -out key.pem 2048
```

2. Create a csr file

```
openssl req -new -key key.pem -out csr.pem
```

3. Create a ssl cer file

```
openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem
```
