# GitHub Action to Delete Cloudflare DNS  🗑️

Used for cleaning up branch deployments (A records and TXT records)

## Usage

All sensitive variables should be [set as encrypted secrets](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables) in the action's configuration.

### `workflow.yml` Example

#### Run using CloudFlare auth token
```yaml
    - name: Delete DNS
      uses: remotecompany/delete-cf-dns-action@v0.0.1
      with:
        token: ${{ secrets.CF_TOKEN }}
        zone: ${{ secrets.CF_ZONE }}
        name: "sub.domain.com"
```

### Purging specific types

To purge only specific types, you can pass an array of **DNS Types**

```yaml
types: "TXT,A"
```

### Testing

Setup .env file from .env.example `cp .env.example .env`

```shell
yarn install
yarn test
```

### Building

The dist folder must be committed and rebuilt each time.

```shell
yarn build
```
