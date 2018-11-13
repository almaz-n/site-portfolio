'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create();


gulp.task('dev', ['build', 'watch', 'browser-sync']);
gulp.task('build', ['html', 'styles', 'scripts', 'assets']);

// Объединение и сжатие JS-файлов
gulp.task("scripts", function() {
    return gulp.src("src/js/*.js") 
        .pipe(concat('scripts.js')) 
        .pipe(uglify()) 
        .pipe(rename({ 
            basename: "app"
        })) 
        .pipe(gulp.dest('./build/js/')); 
});

// Выполняет сборку наших стилей.
gulp.task('styles', function() {
	return gulp.src('src/*.scss')
		.pipe(sourcemaps.init()) 
		.pipe(sass({
            includePaths: require('node-normalize-scss').includePaths
        }))
		.pipe(autoprefixer({ 
			browsers: ['last 2 versions']
		}))
		.pipe(cssnano()) //Минификация стилей
		.pipe(sourcemaps.write())
		.pipe(rename('main.css')) //Переименование
		.pipe(gulp.dest('build/css'));
});

gulp.task('html', function() {
	gulp.src('src/*.html')
		.pipe(gulp.dest('build/'));
});

//Задача для запуска сервера.
gulp.task('browser-sync', function() {
	return browserSync.init({
		server: {
			baseDir: './build/'
		}
	});
});

gulp.task('assets', function() {
	return gulp.src('./src/assets/**/**/*.*')
		.pipe(gulp.dest('./build/assets'));
});

// Задача 'watch' следит за всеми нашими файлами в проекте и при изменении тех или иных перезапустает соответсвующую задачу.
gulp.task('watch', function() {
	gulp.watch('src/scss/**/*.scss', ['styles']); //стили
    gulp.watch('src/js/**/*.js', ['scripts']); //скрипты
    gulp.watch('src/*.html', ['html']); //скрипты
    gulp.watch('src/assets/**', ['assets']); //наши локальные файлы(картинки)
    gulp.watch('src/**/*.*').on('change', browserSync.reload); //Перезапуск browserSynс
});
