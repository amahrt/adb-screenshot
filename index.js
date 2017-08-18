const vorpal = require('vorpal')();
const uuid = require('uuid');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
vorpal
  .command('screenshot [savePath]', 'Screenshots the current device', {})
  .action(async function(args, callback) {
    let savePath = args.savePath ? args.savePath : '$(pwd)';
    const screenshotId = uuid.v4();
    this.log('Creating screenshot ' + screenshotId + '.png');
    try {
      await exec('adb shell screencap -p /sdcard/' + screenshotId + '.png');
      await exec('adb pull /sdcard/' + screenshotId + '.png ' + savePath);
      await exec('adb shell rm /sdcard/' + screenshotId + '.png');
      if (savePath === '$(pwd)') {
        savePath = './'
      }
      this.log('Saved. Path: ' + savePath + screenshotId + '.png');
    } catch (e) {
      this.log('Error occurred.');
      this.log(e);
    } finally {
      callback();
    }
  });

vorpal.delimiter('Helpers$').show();