const gulp         = require('gulp'),
	  sass         = require('gulp-sass'),
	  BrowserSync  = require('browser-sync'),
	  concat       = require('gulp-concat'),
	  htmlmin      = require('gulp-htmlmin'),
	  csso         = require('gulp-csso'),
	  autoprefixer = require('gulp-autoprefixer'),
	  imagemin     = require('gulp-imagemin'),
	  uglify       = require('gulp-uglify-es').default,
	  rename       = require('gulp-rename')





//SASS and BrowserSync
gulp.task('sass', ()=>
	gulp.src('src/sass/**/*.+(sass|scss)')
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(gulp.dest('src/css'))
	.pipe(BrowserSync.reload({stream: true}))
);

gulp.task('sync', ()=>{
	BrowserSync({
		server:{
			baseDir: 'src'
		},
		notify: false
	});
});

gulp.task('watch', ['sync', 'sass'], ()=>{
	gulp.watch('src/sass/**/*.sass', ['sass']);
	gulp.watch('src/**/*.html', BrowserSync.reload);
	gulp.watch('src/css/**/*.css', BrowserSync.reload);
	gulp.watch('src/js/**/*.js', BrowserSync.reload);
});





//Libraries
gulp.task('libsjs', ()=>
	gulp.src('src/libraries/**/*.js')
	.pipe(concat('lib.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/libs/js'))
);

gulp.task('libscss', ()=>
	gulp.src('src/libraries/**/*.css')
	.pipe(concat('lib.css'))
	.pipe(csso())
	.pipe(gulp.dest('src/libs/css'))
);

gulp.task('libs', ['libsjs', 'libscss']);





//Build to production
gulp.task('htmlmin', ()=>
	gulp.src('src/**/*.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(rename({
		extname: '.ejs'
	}))
	.pipe(gulp.dest('prod/views'))
);

gulp.task('cssmin', ()=>
	gulp.src('src/css/**/*.css')
	.pipe(autoprefixer({
			browsers: ['last 0 versions'],
			cascade: false
		}))
	.pipe(csso())
	.pipe(gulp.dest('prod/public/css'))
);

gulp.task('jsmin', ()=>
	gulp.src('src/js/**/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('prod/public/js'))
);

gulp.task('imgmin', ()=>
	gulp.src('src/img/**/*')
	 .pipe(imagemin({
		interlaced: true,
		progressive: true,
		optimizationLevel: 5,
		svgoPlugins: [{removeViewBox: true}]
	 }))
	.pipe(gulp.dest('prod/public/img'))
);

gulp.task('fonts', ()=>
	gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('prod/public/fonts'))
);

gulp.task('libsdistjs', ()=>
	gulp.src('src/libraries/**/*.js')
	.pipe(concat('lib.js'))
	.pipe(uglify())
	.pipe(gulp.dest('prod/public/libs/js'))
);

gulp.task('libsdistcss', ()=>
	gulp.src('src/libraries/**/*.css')
	.pipe(concat('lib.css'))
	.pipe(csso())
	.pipe(gulp.dest('prod/public/libs/css'))
)





//Gulp commands
gulp.task('build', ['htmlmin', 'cssmin', 'jsmin', 'imgmin', 'fonts', 'libsdistjs', 'libsdistcss']);

gulp.task('default', ['watch']);