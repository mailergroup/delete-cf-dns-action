# GitHub Action to Delete Cloudflare DNS  🗑️

Used for cleaning up branch deployments (A records and TXT records)

## Usage

All sensitive variables should be [set as encrypted secrets](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables) in the action's configuration.

### `workflow.yml` Example

#### Run using CloudFlare auth token
```yaml
    - name: Delete DNS
      uses: mailergroup/delete-cf-dns-action@v0.0.1
      with:
        token: ${{ secrets.CF_TOKEN }}
        zone: ${{ secrets.CF_ZONE }}
        name: "sub.domain.com"
```

### Delete specific DNS types

To purge only specific types, you can pass an array of [Types](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4)

The default is "A,TXT"

```yaml
types: "A,TXT"
```

### Testing

Setup .env file from .env.example `cp .env.example .env`

```shell
yarn install
yarn test
```

Tests don't actually delete records, but does query the api for records but stops just before delete

### Building

The dist folder must be committed and rebuilt each time.

```shell
yarn build
```
