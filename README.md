#Simple Upload File Test to S3 using Knox
- Knox
- Express

###Do Not Use THIS FOR PRODUCTION
Sample CORS configuration for Amazon S3 bucket
```javascript
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>HEAD</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

##Configure AWS Credentials
create a `.env` file in project root, with following.  Add your aws settings
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=
AWS_REGION=
```

##Run App

```javascript
 npm install
 node server
```
