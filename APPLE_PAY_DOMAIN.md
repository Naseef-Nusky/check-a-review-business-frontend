# Apple Pay domain verification — business.checkareview.com

Square requires this exact URL to return the verification **file** (not your React app HTML):

`https://business.checkareview.com/.well-known/apple-developer-merchantid-domain-association`

## Files in this repo

- Business portal (static build):  
  `check-a-business-frontend/public/.well-known/apple-developer-merchantid-domain-association`
- API fallback:  
  `check-a-review-backend/public/.well-known/apple-developer-merchantid-domain-association`  
  Served at:
  - `https://YOUR-API/.well-known/apple-developer-merchantid-domain-association`
  - `https://YOUR-API/api/apple-pay/domain-association`

## Fix nginx on business.checkareview.com

Right now that URL returns `index.html` (`Content-Type: text/html`). Apple verification will fail until nginx serves the real file.

### Option A — serve from frontend `dist` (after rebuild + deploy)

```nginx
# Must be BEFORE the SPA try_files / index.html fallback
location = /.well-known/apple-developer-merchantid-domain-association {
    alias /var/www/business.checkareview.com/.well-known/apple-developer-merchantid-domain-association;
    default_type application/octet-stream;
    add_header Content-Type application/octet-stream;
    add_header Content-Disposition attachment;
    access_log off;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

Then:

```bash
cd check-a-business-frontend
npm run build
# copy dist/* to /var/www/business.checkareview.com/
# ensure dist/.well-known/apple-developer-merchantid-domain-association is present
sudo nginx -t && sudo systemctl reload nginx
```

### Option B — proxy to API (if API already has the file)

```nginx
location = /.well-known/apple-developer-merchantid-domain-association {
    proxy_pass http://127.0.0.1:5000/.well-known/apple-developer-merchantid-domain-association;
    proxy_set_header Host $host;
}
```

## Verify before clicking Add Domain in Square

```bash
curl -sI https://business.checkareview.com/.well-known/apple-developer-merchantid-domain-association
```

You want:

- `HTTP/1.1 200`
- `Content-Type: application/octet-stream` (not `text/html`)
- Body starts with hex/JSON payload (not `<!doctype html>`)

```bash
curl -s https://business.checkareview.com/.well-known/apple-developer-merchantid-domain-association | head -c 40
```

Should **not** print `<!doctype html>`.

## Then in Square

1. Developer Dashboard → your app → **Sandbox** or **Production**
2. **Apple Pay** → **Add Domain**
3. Domain: `business.checkareview.com`
4. Square will fetch the verification URL and approve it
