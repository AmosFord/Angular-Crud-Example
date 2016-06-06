var gulp = require('gulp')
var sass = require('gulp-ruby-sass')
var connect = require('gulp-connect')

gulp.task('connect', function () {
	connect.server({
		root: '/Users/amos/sites/employees.com',
		port: 4000
	})
})