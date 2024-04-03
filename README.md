
## Olobase UI Admin Skeleton

Installation.

```sh
git clone git@github.com:olomadev/olobase-skeleton-ui myproject
```

Go to your project root

```sh
cd /var/www/myproject
```

Init olobase-admin submodule

```sh
git submodule update --init
```

Install npm packages

```sh
npm i 
```

## Environments & Run

<a href="https://olobase.dev/docs/latest/ui/environments.html" target="_blank">https://olobase.dev/docs/latest/ui/environments.html</a>

Start your local server

```sh
npm run dev
```

If you are working on a local computer, you can visit http://127.0.0.1:3000. If you are working on a local virtual server, you can type the IP address of your server into your browser and visit an IP address like in this example; http://192.168.231.129:3000.

Exporting your project

With this command, your javascript files compiled for the production environment are exported to the <b>/dist</b> folder.

```sh
npm run build
```

## Installing Node.js Using Nvm Manager

<a href="https://news.oloma.dev/how-to-install-node-js-with-nvm-manager-on-ubuntu-22-04-lts/" target="_blank">https://news.oloma.dev/how-to-install-node-js-with-nvm-manager-on-ubuntu-22-04-lts/</a>

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://vitejs.dev/config/).
