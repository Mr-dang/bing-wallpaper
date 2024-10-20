# README

启动定时任务下载必应首页壁纸:

```shell
pm2 start index.mjs --name bing-wallpaper --log ./logs/bing-wallpaper.log --time
```

## 在Linux中安装puppeteer遇到的问题

在linux中`npm install puppeteer`，使用时会遇上一些报错:

```shell
Error: Failed to launch the browser process!
/home/danglm/daily-mail/.cache/puppeteer/chrome/linux-121.0.6167.85/chrome-linux64/chrome: error while loading shared libraries: libatk-1.0.so.0: cannot open shared object file: No such file or directory
```

因为Linux中缺少一些包, 在ubuntu中安装:

```shell
sudo apt update
sudo apt install libnss3-dev libatk1.0-0 libatk-bridge2.0-0 libcups2 libgbm1 libpangocairo-1.0-0 libgtk-3-0
```

## 在树莓派中使用本脚本

树莓派的架构是 `arm64`，无头浏览器没有提供针对`arm64`架构的二进制文件，因此`puppeteer`调用`chrome`时会失败。
树莓派官方为树莓派系统定制了`chrome`，可执行的应用程序位于 `/usr/bin/chromium-browser`，可以让 `puppeteer` 调用树莓派系统中安装好的 `/usr/bin/chromium-browser` 来执行程序：

```javascript
// puppeteer.config.cjs
module.exports = {
  // Changes the cache location for Puppeteer.
  // cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  executablePath: '/usr/bin/chromium-browser',
  skipDownload: true,
};
```

在本项目中，可切换至 `respberry-pi` 分支使用对应的代码。

## pm2 常用命令

- `pm2 list`
- `pm2 start app.js`
- `pm2 start bashscript.sh`
- `pm2 start python-app.py --watch`
- `pm2 start binary-file -- --port 1520`
- `pm2 stop <id>`
- `pm2 stop <name>`
- `pm2 delete <id>`
- `pm2 delete <name>`

CLI config

```shell
# Specify an app name
--name <app_name>

# Watch and Restart app when files change
--watch

# Set memory threshold for app reload
--max-memory-restart <200MB>

# Specify log file
--log <log_path>

# Pass extra arguments to the script
-- arg1 arg2 arg3

# Delay between automatic restarts
--restart-delay <delay in ms>

# Prefix logs with time
--time

# Do not auto restart app
--no-autorestart

# Specify cron for forced restart
--cron <cron_pattern>

# Attach to application log
--no-daemon
```

**cron使用** 

```shell
// 0/2 * * * * ? 表示每2秒 执行任务
pm2 start __test__/pm2-cron-test.mjs --name pm2-cron-test --log ./logs/pm2-cron-test.log --time --cron "0/2 * * * * ?"
pm2 start pm2-cron-test.mjs --name pm2-cron-tes --log ./logs --time --cron ""
```

## 参考链接

- [puppeteer docs](https://pptr.dev)
- [puppeteer apis](https://pptr.dev/api/puppeteer.puppeteernode)
- [pm2 homepage](https://pm2.keymetrics.io/)
- [pm2 docs](https://pm2.keymetrics.io/docs/usage/quick-start/)