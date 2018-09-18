# proxy-changer
proxy replacement tool for mac. Finds and replaces one of the free proxy addresses.

### install
```
npm i -g proxy-changer
```

### usage
Randomly determines proxy.
#### --set
```
proxy-c
```

#### --off
Brings proxy closed.
```
proxy-c --off
```

#### --on
Brings proxy opened.
```
proxy-c --on
```

default values: ftp, web, secureweb, streaming, gopher, socksfirewall

Use --name if you want to add a proxy for certain values.

```
proxy-c --name web --name ftp
```
