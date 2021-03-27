// ���������� Gulp
var gulp = require("gulp");

var sass = require("gulp-sass"), // ��������� SASS � CSS
    rigger = require('gulp-rigger'),
    include = require('gulp-include')
    autoprefixer = require('gulp-autoprefixer'),
    pug = require('gulp-pug');
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),   //������������� ��������� �������
    clean = require('gulp-clean');

var reload = browserSync.reload;

var path = {
  src: {
    all: 'src/*',
    html: 'src/html/**/*.*',
    js: 'src/js/main.js',
    sass: 'src/sass/**/*.sass',
    images: 'src/images/**/*.+(jpg|jpeg|png|gif)',
    fonts: 'assets/src/fonts/**/*.*'
  },
  dist: {
    clean: 'dist/*',
    html: 'dist/',
    js: 'dist/js/',
    css: 'dist/css/',
    images: 'dist/images/',
    fonts: 'dist/fonts/'
  },
  watch: {
    all: 'src/*',
    html: 'src/html/**/*.*',
    js: 'src/js/main.js',
    sass: 'src/sass/**/*.sass',
    images: 'src/images/**/*.+(jpg|jpeg|png|gif)',
    fonts: 'assets/src/fonts/**/*.*'
  },
  clean: {
      html: 'dist/*.html'
  }
};

// ������� ������� ����
gulp.task('myFirstTask', function (done) {
    console.log('Hello I`m first task!');
    done();
});

// ����������� ������ HTML � ����� dist
gulp.task("html", function (done) {
    return gulp.src("src/html/*.html")
        .pipe(gulp.dest("dist"));
    done();
});

// �����������, ���������� Sass � CSS, ����������� ����. ���������
gulp.task("sass", function (done) {
    return gulp.src(path.src.sass)
        //.pipe(concat('styles.sass'))  //����������� css
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.dist.css));
    done();
});

//��� ����������� ������
gulp.task('include', function (done) {
    gulp.src(path.src.html)
        .pipe(include())
        .pipe(gulp.dest(path.dist.html));
    done();
});

gulp.task('clean-html', function(done){
    gulp.src(path.clean.html).pipe(clean());
    done();
});

gulp.task('browser-sync', function (done) {
    browserSync.init({
        proxy: {
            target: "tortemie.com.ua",
        }
    });
    gulp.watch(path.watch.html).on('change', reload);
    gulp.watch(path.watch.sass).on('change', reload);
    gulp.watch(path.watch.images).on('change', reload);
    gulp.watch(path.watch.images_gallery).on('change', reload);
    done();
});

gulp.task('imgs', function() {
    return gulp.src(path.src.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.images));
});

// ������ �������� �� ����������� �������
gulp.task('watch', function (done) {
    gulp.watch(path.watch.html, gulp.series('clean-html','include'));
    gulp.watch(path.watch.images, gulp.series('imgs'));
    //gulp.watch("src/js/*.js", ["scripts"]);
    gulp.watch(path.watch.sass, gulp.series('sass'));
    done();
});

// ������ ������ �� ���������
gulp.task('default', gulp.series('sass', 'imgs', 'include', 'watch'));
