/**
 * Created by Administrator on 2017-07-03.
 */

// 변수선언 = require('모듈이름');
var gulp = require('gulp');
var include = require('gulp-include');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var spritesmith = require('gulp.spritesmith-multi');
var del = require('del');
var sassGlob = require('gulp-sass-glob');
var merge = require('merge-stream');
var runSequence = require('run-sequence');


/*
 gulp.task( task이름, 함수/익명함수 );
 */


// header, footer, 공통영역 분리
gulp.task('include', function(){
  gulp.src("src/html/*.html")
      .pipe(include())
      .on('error', console.log)

      .pipe(gulp.dest("dist/html"));
});


// sass, autoprefixer 실행

gulp.task('sass', function(){
  return gulp.src('src/scss/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
      .pipe(sassGlob())
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions', "Edge > 0", 'ie >= 8', 'safari >=5', 'iOS >=5',
				'Firefox >=3.0', 'Opera >=10.0', "Android > 0", "iOS > 0", "FirefoxAndroid > 0"
			],
          cascade: false
      }))
      .pipe(concat('style.css'))
      .pipe(sourcemaps.write('../maps'))
      .pipe(gulp.dest('dist/css'));
});

// concat 실행 - 여러 개의 파일을 하나의 파일로 합치는 기능
gulp.task('concat', function() {
  return gulp.src('src/js/*.js')
      .pipe(sourcemaps.init())
      .pipe(concat('common.js'))
      .pipe(sourcemaps.write('../maps'))
      .pipe(gulp.dest('dist/js'));
});


// Clean sprite
gulp.task('clean-sprite', function() {
	return del('dist/images/icons/*');
});


// image sprite
gulp.task('auto-sprite', function() {
	var opts = {
		spritesmith: function (options, sprite, icons){
			options.imgPath =  `../images/icons/${options.imgName}`;
			options.cssName = `_${sprite}-sprite.scss`;
			options.cssTemplate = null;
			options.cssSpritesheetName = sprite;
      options.padding = 10;
			options.cssVarMap =  function(sp) {
				sp.name = `${sprite}-${sp.name}`;
			};
 
			return options;
		}
	};
	var spriteData = gulp.src('src/images/**/*.{jpg,png,gif,svg}').pipe(spritesmith(opts)).on('error', function (err) {
		console.log(err)
    });
	
	var imgStream = spriteData.img.pipe(gulp.dest('dist/images/icons'));
	var cssStream = spriteData.css.pipe(gulp.dest('src/scss/vendors'));
 
	return merge(imgStream, cssStream);
});

// 스프라이트 and SASS
gulp.task('sprite-and-sass', function() {
	runSequence('clean-sprite', 'auto-sprite', 'sass');
});

// pipe()는 모듈의 기능을 실행해주는 함수

gulp.task('watch', function() {
  gulp.watch('src/html/**', ['include']);
  gulp.watch('src/scss/**', ['sass']);
  gulp.watch('src/js/**', ['jsconcat']);
  gulp.watch('src/images/**/*', ['sprite-and-sass']);
});


gulp.task('jsconcat', ['concat']);

gulp.task('default', ['include','sass','jsconcat','watch','sprite-and-sass']);