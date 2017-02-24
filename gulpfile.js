var gulp =require('gulp');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');

var DEV = process.argv.indexOf('--dev') !=-1;


gulp.task('connect',function(){
	connect.server({
		root:'dist',
		livereload: true
		
	});
});

var twig = require('gulp-twig');
var path = require('path');
var flatten = require('gulp-flatten')

  /*complation twig*/
gulp.task('twig',function(){
	gulp.src('src/views/**/*.twig')
		   .pipe(plumber({
			   errorHandler(err){
				   console.log(err);
				   this.emit('end');
			   }
			   
		   }))
	       .pipe(twig())
		   .pipe( flatten())
		   .pipe( gulp.dest(path.join(__dirname,'dist')) )  /*retourne a la racine*/
		   .pipe(connect.reload());
});
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var fs = require('fs');
var files = fs.readdirSync('src/views');
var entries = [];

files.forEach(function(file){
	if(file !='layout'){
		entries.push(`./src/views/${file}/${file}.js`);
	}
	
});
entries.push('./src/assets/script/common.js');
/*compliation j*/

gulp.task('script',function(){           
	entries.map(function(entry){   
	var stream = browserify({
		entries : entry
	
	}).bundle()
	.on('error', function(err){
		console.log(err.message);
		this.emit('end');
	})
	.pipe(source(entry))  
    .pipe(flatten())
	.pipe(buffer());
	if (!DEV){
		 stream.pipe(uglify());
	}
	stream.pipe(gulp.dest('dist/js')).pipe(connect.reload());
	});
});


var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer')
var gcmq = require ('gulp-group-css-media-queries')
var consolidate = require('gulp-consolidate')

/*compliation sass*/

gulp.task('css',['icons'],function(){
	gulp.src('src/**/*.scss')
		.pipe(sass().on('error',sass.logError))
		.pipe(autoprefixer({
			browsers:['last 2 version']
		}))
		.pipe(gcmq())
		.pipe(cleanCss())
		.pipe(flatten())
		.pipe(gulp.dest('dist/css'))
		.pipe(connect.reload());
});

/*copie les images*/

gulp.task('assets', function(){
	gulp.src('src/assets/images/*')
		.pipe(gulp.dest('dist/images'));
	gulp.src('src/assets/data/*')
		.pipe(gulp.dest('dist/data'));
});

/*icons font*/
var iconfont = require ('gulp-iconfont');
var runTimestamp = Math.round(Date.now()/1000);
gulp.task('icons',function(){
	
	gulp.src('src/assets/icons/*.svg')
	    .pipe(iconfont({
			fontName :'icons',
			prependUnicode: true,
			formats: ['ttf','eot','woff','woff2','svg'],
			timestamp: runTimestamp
		}))
		.on('glyphs',function(glyphs,options){	
		   gulp.src('src/assets/stishit/icons/templates.css')
			.pipe(consolidate('lodash',{
				glyphs: glyphs,
				fontName:'icons',
				fontPath: '../fonts/',
				className: 'icons'
				
			}))
			.pipe(gulp.dest('src/assets/stishit'))
			
			gulp.src('src/assets/stishit/icons/template.html')
			.pipe(consolidate('lodash',{
				glyphs: glyphs,
				className: 'icons'
			}))
			
			.pipe(gulp.dest('dist'))
		 
		})
		.pipe(gulp.dest('dist/fonts'));
});  
	

gulp.task('watch',function(){
	gulp.watch('src/**/*.twig',['twig']);
	gulp.watch('src/**/*.js',['script']);
	gulp.watch('src/**/*.scss',['css']);
	gulp.watch('src/assets/icons/*.svg',['css']);
});


gulp.task('default',['twig','script','css','assets','connect','watch'] ,function(){
	
	console.log('default');
});