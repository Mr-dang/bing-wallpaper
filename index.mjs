import Cron from 'cron';
import downLoadBingWallpaper from './bing.mjs'
downLoadBingWallpaper();
new Cron.CronJob(
  '0 0 9 * * *',
  downLoadBingWallpaper,
  null,
  true,
);

console.log('Cron set! 0 0 9 * * *');
