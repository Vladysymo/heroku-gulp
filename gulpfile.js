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



//Sass & BrowserSync
//Компилирует sass файлы в папке src/sass и кидает их в src/css и в node/public/css одновременно
gulp.task('sass', ()=>
	gulp.src('src/sass/**/*.+(sass|scss)')
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(gulp.dest('src/css'))
	.pipe(gulp.dest('node/public/css'))
	.pipe(BrowserSync.reload({stream: true}))
)
//Настройка BrowserSync
gulp.task('sync', ()=>{
	BrowserSync({
		server:{
			baseDir: 'src'
		},
		notify: false
	})
})
//Перемещение .html в бекенд папку и перевод в .ejs
gulp.task('html', ()=>
	gulp.src('src/**/*.html')
	.pipe(rename({
		extname: '.ejs'
	}))
	.pipe(gulp.dest('node/views'))
)
//Перенос css на бекенд разработку
gulp.task('css', ()=> 
	gulp.src('src/css/**/*.css')
	.pipe(gulp.dest('node/public/css'))
)
//Перенос js на бекенд разработку
gulp.task('js', ()=>
	gulp.src('src/js/**/*.js')
	.pipe(gulp.dest('node/public/js'))
)
//Стандартный gulp watch для фронтенда
gulp.task('watch', ['sync', 'sass'], ()=>{
	gulp.watch('src/sass/**/*.sass', ['sass']);
	gulp.watch('src/**/*.html', ['html', BrowserSync.reload]);
	gulp.watch('src/css/**/*.css', ['css', BrowserSync.reload]);
	gulp.watch('src/js/**/*.js', ['js', BrowserSync.reload]);
})





//Libraries
//JS библиотеки собираются воедино, сжимаются и кидаются в фронтенд libs и бекенд libs
gulp.task('libsjs', ()=>
	gulp.src('src/libraries/**/*.js')
	.pipe(concat('lib.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/libs/js'))
	.pipe(gulp.dest('node/public/libs/js'))
)
//CSS библиотеки собираются воедино, сжимаются и кидаются в фронтенд libs и бекенд libs
gulp.task('libscss', ()=>
	gulp.src('src/libraries/**/*.css')
	.pipe(concat('lib.css'))
	.pipe(csso())
	.pipe(gulp.dest('src/libs/css'))
	.pipe(gulp.dest('node/public/libs/css'))
)

gulp.task('libs', ['libsjs', 'libscss']);





//Moving
//Шрифты на бекенд разработку
gulp.task('fontsb', ()=>
	gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('node/public/fonts'))
)
//Картинки на бекенд разработку
gulp.task('img', ()=>
	gulp.src('src/img/**/*')
	.pipe(gulp.dest('node/public/img'))
)






//Build to production

//	Оптимизация фронтенда
//		HTML сжатие
gulp.task('htmlmin', ()=>
	gulp.src('src/**/*.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('dist'))
)
//		CSS автопрефиксер и сжатие
gulp.task('cssmin', ['sass'], ()=>
	gulp.src('src/css/**/*.css')
	.pipe(autoprefixer({
			browsers: ['last 0 versions'],
			cascade: false
		}))
	.pipe(csso())
	.pipe(gulp.dest('dist/css'))
)
 //		JS сжатие
gulp.task('jsmin', ()=>
	gulp.src('src/js/**/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'))
)
//		IMG сжатие
gulp.task('imgmin', ()=>
	gulp.src('src/img/**/*')
	 .pipe(imagemin({
		interlaced: true,
		progressive: true,
		optimizationLevel: 5,
		svgoPlugins: [{removeViewBox: true}]
	 }))
	.pipe(gulp.dest('dist/img'))
)
//		перенос шрифтов
gulp.task('fonts', ()=>
	gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
)
//		перенос уже сжатых библиотек в продакшн
gulp.task('libsdistjs', ()=>
	gulp.src('src/libraries/**/*.js')
	.pipe(gulp.dest('dist/libs/js'))
)
//		перенос уже сжатых библиотек в продакшн
gulp.task('libsdistcss', ()=>
	gulp.src('src/libraries/**/*.css')
	.pipe(gulp.dest('dist/libs/css'))
)

//	Оптимизация бекенда
//		Основной файл app и procfile в prod
gulp.task('mainfiles', ()=>
	 gulp.src(['node/**/*.js', '!node/public/**/*.js', 'node/procfile', 'node/startOffline.bat', 'node/package-lock.json', 'node/package.json'])
	 .pipe(gulp.dest('prod'))
)
//		EJS сжатие
gulp.task('ejsmin', ()=>
	 gulp.src('node/views/**/*.ejs')
	 .pipe(htmlmin({collapseWhitespace: true}))
	 .pipe(gulp.dest('prod/views'))
)
//		CSS сжатие
gulp.task('cssminbackend', ()=>
	gulp.src('node/public/css/**/*.css')
	.pipe(autoprefixer({
			browsers: ['last 0 versions'],
			cascade: false
		}))
	.pipe(csso())
	.pipe(gulp.dest('prod/public/css'))
)
//		JS сжатие
gulp.task('jsminbackend', ()=>
	gulp.src('node/public/js/**/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('prod/public/js'))
)
//		IMG сжатие
gulp.task('imgminbackend', ()=>
	gulp.src('node/public/img/**/*')
	 .pipe(imagemin({
		interlaced: true,
		progressive: true,
		optimizationLevel: 5,
		svgoPlugins: [{removeViewBox: true}]
	 }))
	.pipe(gulp.dest('prod/public/img'))
)
//		перенос шрифтов
gulp.task('fontsbackend', ()=>
	gulp.src('node/public/fonts/**/*')
	.pipe(gulp.dest('prod/public/fonts'))
)
//		перенос уже сжатых библиотек в продакшн
gulp.task('libsdistjsbackend', ()=>
	gulp.src('node/public/libraries/**/*.js')
	.pipe(gulp.dest('prod/public/libs/js'))
)
//		перенос уже сжатых библиотек в продакшн
gulp.task('libsdistcssbackend', ()=>
	gulp.src('node/public/libraries/**/*.css')
	.pipe(gulp.dest('prod/public/libs/css'))
)




//Gulp commands
//Development
gulp.task('default', ['watch'])

gulp.task('gobackend', ['html', 'css', 'js', 'fontsb', 'img', 'libsjs', 'libscss'])

//Production
gulp.task('buildf', ['htmlmin', 'cssmin', 'jsmin', 'imgmin', 'fonts', 'libsdistjs', 'libsdistcss'])

gulp.task('buildb', ['mainfiles', 'ejsmin', 'cssminbackend', 'jsminbackend', 'imgminbackend', 'fontsbackend', 'libsdistjsbackend', 'libsdistcssbackend'])