'use strict'

const gulp = require('gulp')
const del = require('del')
const path = require('path')

const DIR_FOLD = path.join(__dirname, '/dist')

gulp.task('clean', () => {
    return del([DIR_FOLD])
})
