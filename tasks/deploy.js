const gulp = require('gulp');
const fs = require('fs');
const AWS = require('aws-sdk');
const moment = require('moment');

const getPackageJson = () => JSON.parse(fs.readFileSync('./package.json', 'utf8'));
/**
 * Send instruction to code deploy to deploy artificat identified by bucketKey and eTag
 * @param bucketKey
 * @param eTag
 * @param cb
 */
const deploy = (bucketKey, eTag, cb) => {
  const codeDeployConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
  };
  const codeDeploy = new AWS.CodeDeploy(codeDeployConfig);

  const deploymentConfig = {
    applicationName: process.env.APPLICATION_NAME,
    deploymentGroupName: process.env.DEPLOYMENT_GROUP_NAME,
    revision: {
      revisionType: 'S3',
      s3Location: {
        bucket: process.env.S3_BUCKET,
        key: bucketKey,
        bundleType: 'zip',
        eTag,
      },
    },
    deploymentConfigName: process.env.DEPLOYMENT_CONFIG,
    description: 'New deployment from BitBucket',
    ignoreApplicationStopFailures: true,
    autoRollbackConfiguration: {
      enabled: true,
      events: ['DEPLOYMENT_FAILURE'],
    },
  };
  console.log('Deployment config: ', deploymentConfig);
  codeDeploy.createDeployment(deploymentConfig, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
    cb(err);
  });
};

/**
 * $ gulp deploy
 * description: Upload /tmp/artifact.zip file to S3 and deploy it via Code Deploy
 * Used fo CI (Bitbucket Pipelines)
 */
gulp.task('deploy', (cb) => {
  console.log(`Start deploy task with NODE_ENV = ${process.env.NODE_ENV}`);
  process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'sandbox';
  const path = '/tmp/artifact.zip';
  const key = `${process.env.APPLICATION_NAME}/${process.env.NODE_ENV}/bitbucket_build_${process.env.BITBUCKET_COMMIT.substr(0, 7)}_${getPackageJson().version}_${moment().format('YYYYMMDDHHmmss')}.zip`;
  const s3Config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,

  };

  console.log(`Reading file: ${path}`);
  fs.readFile(path, (err, data) => {
    if (err) throw err;
    console.log('Starting upload');
    const s3 = new AWS.S3(s3Config);

    const objectConfig = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: data,
      ContentType: 'application/zip',
    };

    s3.putObject(objectConfig, (e, d) => {
      if (e) {
        cb(e);
      } else {
        console.log('Upload success');
        deploy(key, d.ETag, cb);
      }
    });
  });
});
