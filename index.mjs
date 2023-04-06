import Cron from 'cron';
import downLoadBingWallpaper from './src/downLoadBingWallpaper.mjs'

new Cron.CronJob(
  '* * 9 * * *',
  downLoadBingWallpaper,
  null,
  true,
)