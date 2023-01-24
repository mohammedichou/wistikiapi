const gulp = require('gulp');
const fs = require('fs');
const git = require('gulp-git');
const util = require('gulp-util');
const excludeGitignore = require('gulp-exclude-gitignore');
const conventionalChangelog = require('gulp-conventional-changelog');
const tagVersion = require('gulp-tag-version');
const bump = require('gulp-bump');
const { join } = require('path');

/**
 * Returns version value in package.json
 */
const getPackageJson = () => JSON.parse(fs.readFileSync('./package.json', 'utf8'));

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

const inc = importance =>
  // get all the files to bump version in
  gulp.src(['./package.json'])
  // bump the version number in those files
    .pipe(bump({ type: importance }))
    // save it back to filesystem
    .pipe(gulp.dest('./'));

/**
 * Commit with message passed
 */
const commit = () => {
  const message = util.env.message ? util.env.message : `Release v${getPackageJson().version}`;
  return gulp.src('./', { buffer: false })
    .pipe(excludeGitignore())
    .pipe(git.add())
    .pipe(git.commit(message));
};

const push = () => git.push('origin', 'develop', { args: '--tags -f' });

const tag = () => gulp.src(['./package.json']).pipe(tagVersion());

const changelog = () => gulp.src('CHANGELOG.md', {
  buffer: false,
})
  .pipe(conventionalChangelog({
    preset: 'eslint',
    releaseCount: 0,
    verbose: true,
  }, null, null, null, {
    // mainTemplate: fs.readFileSync(join(__dirname, 'changelog/template.hbs'), 'utf-8'),
    headerPartial: fs.readFileSync(join(__dirname, 'changelog/header.hbs'), 'utf-8'),
    commitPartial: fs.readFileSync(join(__dirname, 'changelog/commit.hbs'), 'utf-8'),
  }))

  .pipe(gulp.dest('./'));

gulp.task('git:changelog:prerelease', ['git:prerelease'], changelog);
gulp.task('git:changelog:patch', ['git:patch'], changelog);
gulp.task('git:changelog:feature', ['git:feature'], changelog);
gulp.task('git:changelog:release', ['git:release'], changelog);

gulp.task('git:tag:prerelease', ['git:commit:prerelease'], tag);
gulp.task('git:tag:patch', ['git:commit:patch'], tag);
gulp.task('git:tag:feature', ['git:commit:feature'], tag);
gulp.task('git:tag:release', ['git:commit:release'], tag);

gulp.task('git:commit:prerelease', ['git:prerelease', 'git:changelog:prerelease'], commit);
gulp.task('git:commit:patch', ['git:patch', 'git:changelog:patch'], commit);
gulp.task('git:commit:feature', ['git:feature', 'git:changelog:feature'], commit);
gulp.task('git:commit:release', ['git:release', 'git:changelog:release'], commit);

gulp.task('git:push:prerelease', ['git:tag:prerelease'], push);
gulp.task('git:push:patch', ['git:tag:patch'], push);
gulp.task('git:push:feature', ['git:tag:feature'], push);
gulp.task('git:push:release', ['git:tag:release'], push);

gulp.task('git:patch', () => inc('patch'));
gulp.task('git:feature', () => inc('minor'));
gulp.task('git:release', () => inc('major'));
gulp.task('git:prerelease', () => inc('prerelease'));

gulp.task('git:changelog', changelog);
