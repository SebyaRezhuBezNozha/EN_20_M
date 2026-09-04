let sec_per_turn = 30;

let sec = 0;
let song_count = 0;
let poster_count = 1;
let answers;
let correct = 0;
let score = 0;
let f_packages = 1;
let m_packages = 1;
let gr_packages = 1;
let hardcore_level = 1;
let options;
let skill = '';
let rate = '';
let lang = '';
let year = '';
let genre = '';
let artist_type = '';
let audioPath = 'audio/ru/';
let imgPath = 'img/';
let finalMessage = '';
let modeToggle;
let setMedia;
let rightAnswer;
let toggleFlag = false;
let withoutAnswers = false;
let isSingle = true;
let audio;
let start_count_down = false;
let rating = [];
let songs_backup;
let overall;

function mirror(txt, speed = 20, color){
$('#mirror_txt').replaceWith( '<marquee id="mirror_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function mirror_eval(txt, speed = 20, color){
$('#eval_txt').replaceWith( '<marquee id="eval_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function choose(num){
	$('#pause').show();
	let answer = '';
	if(num){
		answer = options[num-1];
	} else {
		answer = $('#answer_input').val();
	}
	start_count_down = false;
	if(audio && audio.paused){
		audio.play();
	}
	modeToggle();
	let group = songs[song_count].group;
	let song = songs[song_count].song;
	let song_year = songs[song_count].year;
	if(!song_year) {
		song_year = '';
	} else {
		song_year = ' (' + song_year + ')';
	}
	if(answer.toUpperCase() == songs[song_count].group.toUpperCase()){
		mirror_eval(rightAnswer(song_year), 20, "green");
		$("#option_" + num).addClass("green");
		correct++;
		if (!~rate.indexOf('+ ' + group)){
			$('#rate').html(rate = '<br/>+ ' + group + rate);
		}
		$('#score').html(++score);
	} else {
		mirror_eval(rightAnswer(song_year), 20, "red");
		$("#option_" + num).addClass("red");
		$('#skill').html(skill = '<br/>- ' + group + '<br/>"' + song + '"' + song_year + skill);
	}
		toggleGameButton();
		next();
}

function rightAnswer_EN(){
	return songs[song_count].song;
}

function rightAnswer_RU(year){
	return songs[song_count].group + ' "' + songs[song_count].song + '"' + year;
}

function next(){
	if(song_count==songs.length-1){
		$('#song_count').html(song_count+1);
		$('#song').css("visibility", "hidden");
		$('#mirror').show();
		let overall = songs.length
		let percent = calculatePercent(correct,overall);
		let msg = 'Верно: ' + percent + '%('
		+ correct + '/' + overall + ').';
		let color = 'red';
		if(percent>=65){
			color = 'green';
			msg+=finalMessage; 
		} else{
			msg+=' Послушайте ещё песенок и попробуйте снова.'
		}
		mirror(msg, 20, color);
		emptyOptions();
		song_count=0;
		shuffle(songs);
	} else {
		$('#song_count').html(++song_count);
		toggleLearn();
	}
}

function calculatePercent(correct,overall){
	let num = correct/overall*100;
	return parseFloat(num).toFixed(0);
}

function toggle(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
		$('.game_button').prop('disabled', true);
	} else {
		$('#learn').prop('disabled', true);
		$('.game_button').prop('disabled', false);
	}
}

function toggleLearn(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
	} else {
		$('#learn').prop('disabled', true);
	}
}

function toggleGameButton(){
	if($('.game_button').is('[disabled]')){
		$('.game_button').prop('disabled', false);
	} else {
		$('.game_button').prop('disabled', true);
	}
}

let lang_letter;

function learn(){
	hide_navi_icons();
	if(withoutAnswers){
		$('.without_answers').show();
	} else {
		$('.answer').show();
	}
	$('#pause').hide();
	$('#back').hide();
	$('#package_content').hide();
	$('#answer_input').val('');
	decolorOptions();
	modeToggle();
	toggleLearn();
	toggleGameButton();
	randomAnswers();
	setMedia();
	count_down(sec_per_turn);
	$('#mirror').hide();
}

async function sec_15(){
	if(audio.paused){
		audio.play();
		count_down(15);
	} else {
		audio.currentTime += 15;
		if(time_left < 15){
			time_left = 15;
		}
	}
}

function song_pause() {
	if(audio.paused){
		audio.play();
	} else {
		audio.pause();
	}
}

let time_left = 0;
async function count_down(end){
	start_count_down = true;
	time_left = end;
	while(start_count_down && time_left-- > 0){
		await sleep(1000);
		if(isSingle){	
			$('#sec').html(new Intl.NumberFormat().format(sec+=1));
		} else if(isP1Turn) {
			$('#p1_sec').html(new Intl.NumberFormat().format(p1_sec+=1));
		} else {
			$('#p2_sec').html(new Intl.NumberFormat().format(p2_sec+=1));
		}
	}
	if(start_count_down){
		audio.pause();
	}
}

let time_min = 0;
async function count_time(){
	while(true){
		await sleep(60000);
		$('#min').html(++time_min);
	}
}

function time_toggle() {
	$('#sec_h2').toggle();
	$('#min_h2').toggle();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function decolorOptions(){
	for(let i = 1; i <= 4; i++){
		$("#option_" + i).removeClass("red");
		$("#option_" + i).removeClass("green");
	}
}

function setAudio(){
	if(audio){
		audio.pause();
	}
	if(!songs[song_count].audioPath){
		audio = new Audio(audioPath + songs[song_count].id + '.mp3');
	} else {
		audio = new Audio(songs[song_count].audioPath + '.mp3');
	}
	audio.play();
}

function randomAnswers(){
	options = [];
	let current_answers = answers;
	current_answers = removeDuplicates(current_answers);
	let correctAnswer = songs[song_count].group;
	options.push(correctAnswer);
	removeItemOnce(current_answers,correctAnswer);
	if(current_answers.length > 4){
		removeItemOnce(answers,correctAnswer);
	} else {
		current_answers = removeItemOnce(removeDuplicates(songs.map(item=>item.group)),correctAnswer);
	}
	shuffle(current_answers);
	options.push(current_answers[0]);
	options.push(current_answers[1]);
	options.push(current_answers[2]);
	shuffle(options);
	$('#option_1').html(options[0]);
	$('#option_2').html(options[1]);
	$('#option_3').html(options[2]);
	$('#option_4').html(options[3]);
}

function skipGroup(flag, group){
	group = group.replace("#", "'");
	if(!flag.checked){
		songs = jQuery.grep(songs, function(value) {
		  return value.group != group;
		});
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	} else {
		$('.group_item').prop('checked', true);
		songs = songs_backup;
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	}
}

function emptyOptions(){
	$('#option_1').html('');
	$('#option_2').html('');
	$('#option_3').html('');
	$('#option_4').html('');
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeDuplicates(arr) {
	var uniqueValues = [];
	$.each(arr, function(i, el){
		if($.inArray(el, uniqueValues) === -1) uniqueValues.push(el);
	});
	return uniqueValues;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function play_pause() {
   var mediaVideo = $("#song").get(0);
   if (mediaVideo.paused) {
       mediaVideo.play();
   } else {
       mediaVideo.pause();
  }
}

function toggleArtist(){
	if(toggleFlag){
		$('#artist').attr("src",  songs[song_count].imgPath + ".jpg");
		$('#artist').toggle();
	} else {
		toggleFlag = true;
	}
}

function load(){
	$('#answer_input').keypress(function (e) {
	  if (e.which == 13) {
		choose();
		return false;
	  }
	});	
	setup();
}

// EN songs
const en_2010_m_icon = [
	'pop',
	'dj',
	'rap',
	'pop_2'
];

const EN_2010_M_PACK_1 = 1;
const EN_2010_M_PACK_2 = 2;
const EN_2010_M_PACK_3 = 3;
const EN_2010_M_PACK_4 = 4;

let en_2010_m = [
	{
		pack : EN_2010_M_PACK_3,
		group : 'Lil Nas X',
		song : "Old Town Road (2018)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Luis Fonsi',
		song : "Despacito (ft Daddy Yankee) (2017)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Bruno Mars',
		song : "Uptown Funk (ft. Mark Ronson) (2014)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Pharrell Williams',
		song : "Blurred Lines (ft TI, Robin Thicke) (2013)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Wiz Khalifa',
		song : "See You Again (ft Charlie Puth) (2015)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Ed Sheeran',
		song : "Shape of You (2017)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Drake',
		song : "God's Plan (2018)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Pharrell Williams',
		song : "Happy (2013)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Drake',
		song : "In My Feelings (2018)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Eminem',
		song : "Love the Way You Lie (ft. Rihanna) (2010)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Bruno Mars',
		song : "Grenade (2010)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Bruno Mars',
		song : "24K Magic (2016)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Ed Sheeran',
		song : "Perfect (2017)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Ed Sheeran',
		song : "Bad Habits (2021)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Justin Bieber',
		song : "What Do You Mean? (2015)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Justin Bieber',
		song : "Sorry (2015)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Justin Bieber',
		song : "Yummy (2020)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Pitbull',
		song : "Give Me Everything (ft. Ne-Yo, Afrojack, Nayer) (2011)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Pitbull',
		song : "Timber (ft. Kesha) (2013)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Pitbull',
		song : "Back in Time (2012)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Drake',
		song : "Hotline Bling (2015)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Pharrell Williams',
		song : "Get Lucky (ft Daft Punk) (2013)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Flo Rida',
		song : "Good Feeling (2012)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Flo Rida',
		song : "Whistle (2012)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'will.i.am',
		song : "This Is Love (ft Eva Simons) (2012)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'will.i.am',
		song : "Scream & Shout (ft Britney Spears) (2012)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Weeknd',
		song : "Blinding Lights (2019)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Weeknd',
		song : "The Hills (2015)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Weeknd',
		song : "Heartless (2019)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'will.i.am',
		song : "#thatPOWER (ft Justin Bieber) (2013)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Harry Styles',
		song : "Watermelon Sugar (2020)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Alan Walker',
		song : "Faded (2015)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Alan Walker',
		song : "Alone (2016)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Tiesto',
		song : "Wasted (ft Matthew Koma)(2014)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Tiesto',
		song : "Red Lights (2014)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Kanye West',
		song : "All Of The Lights (ft Rihanna & Kid Cudi) (2010)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Kanye West',
		song : "Bound 2 (2013)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Armin van Buuren',
		song : "This Is What It Feels Like (ft Trevor Guthrie)",
		year : 2013
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Robin Schulz',
		song : "Prayer in C (ft Lilly Wood and the Prick)",
		year : 2014
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Robin Schulz',
		song : "Sugar (ft Francesco Yates)",
		year : 2015
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Alan Walker',
		song : "All Falls Down (2017)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Armin van Buuren',
		song : "Blah Blah Blah (2018)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'David Guetta',
		song : "Memories (ft Kid Cudi) (2010)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'David Guetta',
		song : "Sweat (ft Snoop Dogg) (2011)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'David Guetta',
		song : "Titanium (ft Sia) (2011)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Robin Schulz',
		song : "Waves (ft Mr Probz) (2014)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Tiesto',
		song : "Jackie Chan (ft Dzeko, Preme, Post Malone) (2018)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Marshmello',
		song : "Wolves (ft Selena Gomez) (2017)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Marshmello',
		song : "Happier (ft Bastille) (2018)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Marshmello',
		song : "Friends (ft Anne-Marie) (2018)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Calvin Harris',
		song : "One Kiss (ft Dua Lipa) (2018)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Calvin Harris',
		song : "Feels (ft Pharrell Williams, Katy Perry and Big Sean) (2017)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Calvin Harris',
		song : "Summer (2014)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Martin Garrix',
		song : "In the Name of Love (ft Bebe Rexha) (2016)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Martin Garrix',
		song : "Scared to Be Lonely (ft Dua Lipa) (2017)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Martin Garrix',
		song : "Summer Days (ft Macklemore, Patrick Stump) (2019)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Armin van Buuren',
		song : "Another You (ft Mr Probz) (2018)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Flo Rida',
		song : "My House (2015)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Harry Styles',
		song : "Sign of the Times (2017)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Harry Styles',
		song : "Adore You (2019)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Kanye West',
		song : "I Love It (ft Lil Pump) (2018)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Lil Nas X',
		song : "Panini (ft DaBaby) (2019)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Lil Nas X',
		song : "Rodeo (ft Cardi B) (2019)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Luis Fonsi',
		song : "Échame la Culpa (ft Demi Lovato) (2017)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Wiz Khalifa',
		song : "Black and Yellow (2010)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Wiz Khalifa',
		song : "Young, Wild & Free (ft Snoop Dogg & Bruno Mars) (2011)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Shawn Mendes',
		song : "Señorita (ft Camila Cabello) (2019)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Shawn Mendes',
		song : "There's Nothing Holdin' Me Back (2017)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Shawn Mendes',
		song : "Stitches (2015)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Sam Smith',
		song : "Diamonds (2020)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Sam Smith',
		song : "Too Good at Goodbyes (2017)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Sam Smith',
		song : "Stay with Me (2014)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Post Malone',
		song : "Circles (2019)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Post Malone',
		song : "Wow (2018)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Post Malone',
		song : "Better Now (2018)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Kendrick Lamar',
		song : "Humble (2017)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Kendrick Lamar',
		song : "Swimming Pools (Drank) (2012)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Kendrick Lamar',
		song : "Love (ft Zacari) (2017)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Hozier',
		song : "Take Me to Church (2013)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Hozier',
		song : "Someone New (2015)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Hozier',
		song : "Movement (2018)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Jason Derulo',
		song : "Savage Love (Laxed – Siren Beat)(ft Jawsh 685) (2020)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Jason Derulo',
		song : "Want to Want Me (2015)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Jason Derulo',
		song : "Talk Dirty (ft 2 Chainz) (2013)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Tinie Tempah',
		song : "Written in the Stars (ft Eric Turner) (2010)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Tinie Tempah',
		song : "Pass Out (2010)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Tinie Tempah',
		song : "Miami 2 Ibiza (ft Swedish House Mafia) (2010)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'XXXTentacion',
		song : "Fuck Love (ft Trippie Redd) (2017)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'XXXTentacion',
		song : "Sad! (2018)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'XXXTentacion',
		song : "Moonlight (2018)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Tinie Tempah',
		song : "Not Letting Go (ft Jess Glynne) (2015)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Wiz Khalifa',
		song : "Work Hard, Play Hard (2012)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'will.i.am',
		song : "Fall Down (ft Miley Cyrus) (2013)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Charlie Puth',
		song : "We Don't Talk Anymore (ft Selena Gomez) (2016)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Charlie Puth',
		song : "Attention (2017)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'Charlie Puth',
		song : "One Call Away (2015)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Pitbull',
		song : "International Love (2011)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Kanye West',
		song : "Bound 2 (2013)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Kanye West',
		song : "Power (2010)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Kanye West',
		song : "Fade (2016)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : "Rag'n'Bone Man",
		song : "Human (2016)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : "Rag'n'Bone Man",
		song : "Skin (2017)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : "Rag'n'Bone Man",
		song : "Giant (ft Calvin Harris) (2019)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : "Troye Sivan",
		song : "Youth (2015)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : "Troye Sivan",
		song : "My My My! (2018)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : "Troye Sivan",
		song : "Wild (2015)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Lost Frequencies (Dj)',
		song : "Are You with Me (2014)"
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Lost Frequencies (Dj)',
		song : "Crazy (ft Zonderling) (2017)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_2,
		group : 'Lost Frequencies (Dj)',
		song : "Reality (ft Janieck Devy) (2015)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Lil Peep',
		song : "Save That Shit (2017)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Lil Peep',
		song : "Star Shopping (2015)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Lil Peep',
		song : "U Said (2017)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Lil Pump',
		song : "Gucci Gang (2017)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Lil Uzi Vert',
		song : "XO TOUR Llif3 (2017)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'David Kushner',
		song : "Burn (2022)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Myles Smith',
		song : "Nice To Meet You (2024)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Machine Gun Kelly',
		song : "my ex's best friend (ft blackbear) (2020)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Tommy Richman',
		song : "MILLION DOLLAR BABY (2024)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Alec Benjamin (Dj)',
		song : "Let Me Down Slowly (2018)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Alex Ferrari',
		song : "Bara Bara Bere Bere (2012)"
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'blackbear',
		song : "idfc (2014)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'BØRNS',
		song : "Electric Love (2014)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Desiigner',
		song : "Panda (2015)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Duke Dumont (Dj)',
		song : "Ocean Drive (2015)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'FINNEAS',
		song : "Let's Fall in Love for the Night (2018)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Flying Decibels (Dj)',
		song : "The Roads (2017)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'George Ezra',
		song : "Budapest (2013)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'J Balvin',
		song : "Mi Gente (ft Willy William) (2017)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'John Newman',
		song : "Love Me Again (2013)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'John Legend',
		song : "All of Me (2013)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Lucenzo',
		song : "Danza Kuduro (ft Don Omar) (2011)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Major Lazer',
		song : "Lean On (ft MØ & DJ Snake) (2015)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Mark Ronson',
		song : "Uptown Funk (ft Bruno Mars) (2014)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Masked Wolf',
		song : "Astronaut In The Ocean (2019)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Michel Telo',
		song : "Ai Se Eu Te Pego (2011)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Måns Zelmerlöw',
		song : "Heroes (2015)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Naughty Boy',
		song : "La La La (ft Sam Smith) (2013)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Ola',
		song : "I'm In Love (2012)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Olly Murs',
		song : "Troublemaker (ft Flo Rida) (2012)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Passenger',
		song : "Let Her Go (2012)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Sak Noel (Dj)',
		song : "Loca People (What the F**k!) (2011)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Tony Igy (Dj)',
		song : "Astronomia (2010)",
		ignore : true
	},
	{
		pack : EN_2010_M_PACK_3,
		group : 'Travis Scott',
		song : "HIGHEST IN THE ROOM (2019)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Two Feet',
		song : "I Feel Like I'm Drowning (2017)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Willy William (Dj)',
		song : "Ego (2011)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Zac Efron',
		song : "Rewrite the Stars (ft Zendaya) (2017)"
	},
	{
		pack : EN_2010_M_PACK_1,
		group : 'ZAYN',
		song : "PILLOWTALK (2016)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Rema',
		song : "Calm Down (2022)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Shaboozey',
		song : "A Bar Song (Tipsy) (2024)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Vance Joy',
		song : "Riptide (2013)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Imanbek',
		song : "Roses (2019)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Alex Warren',
		song : "Ordinary (2025)"
	},
	{
		pack : EN_2010_M_PACK_4,
		group : 'Lewis Capaldi',
		song : "Someone You Loved (2018)"
	}
];

let en_2010_m_1 =	en_2010_m.filter(item => item.pack == 1);
let en_2010_m_2 =	en_2010_m.filter(item => item.pack == 2);
let en_2010_m_3 =	en_2010_m.filter(item => item.pack == 3);
let en_2010_m_4 =	en_2010_m.filter(item => item.pack == 4);

let music = [
	{
		arr: en_2010_m,
		lang: 'en',
		year: '2010',
		type: 'm',
		packs: [
				{
					arr: en_2010_m_1,
					name: 'EN 2010s Male: Pop',
				},
				{
					arr: en_2010_m_2,
					name: 'EN 2010s Male: Dj',
				},
				{
					arr: en_2010_m_3,
					name: 'EN 2010s Male: Rap',
				},
				{
					arr: en_2010_m_4,
					name: 'EN 2010s Male: One Hit Wonder',
				}
			]
	}
]

let songs_to_map;
let mapping_result;
function map_songs(){
	back = back_to_current_pack;
	$('.package').hide();
	$('#mirror').hide();
	$('#map').hide();
	$('#package_content').hide();
	$('#sec_15_hist').show();
	$('#mapping_content').show();
	toggleLearn();
	for(var j=0; j < music.length; j++){
		music[j].arr = generateSongIdsWithPrefix(music[j].arr, music[j].lang, 
												music[j].year, music[j].type);
	}
	showMapping(0, "en_2000_gr", "gr");
}

function select_mapping_button(suffix, type){
	$('.gr').attr('src', 'img/chart/gr.png');
	$('.m').attr('src', 'img/chart/m.png');
	$('.f').attr('src', 'img/chart/f.png');
	let selected = 'img/chart/' + type + '_selected.png';
	$('#btn_' + suffix).attr('src', selected);
}

function showMapping(index, suffix, type){
	select_mapping_button(suffix, type);
	mapping_result = '';
	let h1_start = `<h1>`;
	let h1_end = `</h1>`;
	let br = `<br/>`;
	let hr = `<hr/>`;
	for(var j=0; j < music[index].packs.length; j++){
		mapping_result += h1_start + music[index].packs[j].name + h1_end;
		mapping_result += map_songs_format(music[index].packs[j].arr);
		mapping_result += br + hr;
	}
	$('#mapping_content').html(mapping_result);
}

function generateSongIdsWithPrefix(arr, lang, year, type){
	let prefix = lang + '_' + year + '_' + type + '_';
	let audioPath = 'audio/' + lang + '/' + year + '/' + type + '/';
	let imgPath = 'img/' + lang + '/' + year + '/' + type + '/';
	let id;
	for(var i=1; i <= arr.length; i++){
		id = 'Song (' + i + ')';
		arr[i-1].id = prefix + id;
		arr[i-1].audioPath = audioPath + id;
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generateSongIdsByPaths(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function generateSongIdsImgGroup(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generatePathsBySongName(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].audioPath = audioPath + arr[i-1].group;
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function map_songs_format(arr){
	arr = arr.filter(song => !song.ignore);
	let h2_start = `<h2 style='margin-bottom: -20px;'>`;
	let h2_end = `</h2>`;
	let h3_start = `<h3 style='font-family: serif; margin-left: 30px;' >`;
	let h3_end = `</h3>`;
	let div_start = `<div>`;
	let div_end = `</div>`;
	let br = `<br/>`;
	//let img_start = `<img width="300" height="300" src="`;
	let img_end = `.jpg" />`;
	let img_play_start = `<img class='pointer onhover' width="30" height="30" src="img/navi/play.png" onclick="playSong('`;
	let img_play_middle = `')" id='`;
	let img_play_end = `'" />`;
	let space = '&nbsp;';
	songs_to_map = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let curr_group = songs_to_map[0].group;
	//let result = img_start + songs_to_map[0].imgPath + img_end + br
	let result = h2_start + curr_group + ':' + h2_end + h3_start;
	let id;
	for(let i = 0; i < songs_to_map.length; i++){
		id = songs_to_map[i].id.replace(' ', '_').replace('(', '').replace(')', '');
		if(curr_group != songs_to_map[i].group){
			curr_group = songs_to_map[i].group;
			result += h3_end + h2_start + songs_to_map[i].group + ':' + h2_end 
			+ h3_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id
			+ img_play_middle + id + img_play_end + div_end;
		} else {
			result += div_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id 
			+ img_play_middle + id + img_play_end
			+ div_end;
		}
	}
	result += h3_end;
	return result;
}

let last_song_id;
let is_playing = false;
function playSong(audioPath, id){
	if(id == last_song_id){
		if(is_playing){
			audio.pause();
			$('#' + id).attr('src', 'img/navi/play.png');
			is_playing = false;
		} else {
			audio.play();
			$('#' + id).attr('src', 'img/navi/pause.png');
			is_playing = true;
		}
	} else {
		if(audio){
			audio.pause();
		}
		$('#' + last_song_id).attr('src', 'img/navi/play.png');
		last_song_id = id;
		is_playing = true;
		$('#' + id).attr('src', 'img/navi/pause.png');
		audio = new Audio(audioPath + '.mp3');
		audio.play();
	}
}

function getGroupNamesSorted(){
	let group_names = removeDuplicates(songs.map(item=>item.group)).sort();
	return group_names;
}

function showGroupNames(){
	songs_backup = songs;
	let group_names = getGroupNamesSorted();
	
	let tag_1 = `<h3><label class='checkbox-google'><input class='group_item' checked id='group_`;
	let tag_2 = `' type='checkbox' onchange='skipGroup(this,"`;
	let tag_3 = `");'><span class='checkbox-google-switch'></span></label> `;
	let tag_4 =	`</h3>`;
	let result = '';
	for(let i = 0; i < group_names.length; i++){
		result += tag_1 + i + tag_2 + group_names[i].replace("'", "#") + tag_3 + group_names[i] + tag_4;
	}
	$('#package_content').html(result);
	$('#package_content').show();
	toggleLearn();
}

function hide_navi_icons(){
	$('#map').hide();
	$('#mirror').hide();
	$('.settings').hide();
	
	$('#sec_15').show();
	$('#back').show();
}

let gr_package_names = [];
let package_names;

function show_packages(num){
	for(var i=1; i <= num; i++){
		if(package_names[i-1]){
			$('#package_' + i).attr("src", 'img/package/' + package_names[i-1] + ".png");
		} else {
			$('#package_' + i).attr("src", 'img/package/' + i + ".png");
		}
		$('#package_' + i).show();
	}
}

function package_num(num){
	$('#current_pack').show();
	$('#current_pack').attr('src', $('#package_' + num).attr('src'));
	$('.package').hide();
	setPathsByPack(num);
	showGroupNames();
}

function setPaths(artist_type, package_num, genre){
		let songs_str = lang + '_' + year;
			audioPath = 'audio/' + lang + '/' + year + '/';
			imgPath = 'img/' + lang + '/' + year + '/';
		if(genre){
			songs_str += '_' + genre;
			audioPath += genre + '/';
			imgPath += genre + '/';
		}
		if(artist_type){
			songs_str += '_' + artist_type;
			audioPath += artist_type + '/';
			imgPath += artist_type + '/';
		}
		if(package_num){
			songs_str += '_' + package_num;
			audioPath += package_num + '/';
			imgPath += package_num + '/';
		}
		songs = generateSongIds(eval(songs_str));
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
}

function setPathsByPack(num){
	let arr = generateSongIds(eval(lang + '_' + year + '_' + artist_type));
	songs = arr.filter(song => song.pack == num && !song.ignore);
	songs.forEach(song => {
		song.audioPath = 'audio/' + lang + '/' + year + '/' + artist_type + '/' + song.id;
		song.imgPath = 'img/' + lang + '/' + year + '/' + artist_type + '/' + song.group;
	});
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	shuffle(songs);
}
	
function setMusicalAlphabet(){
	let result = [];
	let arr = generateSongIds(eval(lang + '_' + year + '_gr'));
	let arr_pack;
	audioPath = 'audio/' + lang + '/' + year + '/gr/';
	imgPath = 'img/' + lang + '/' + year + '/gr/';
	for(let i = 1; i <= gr_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Группа', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_m'));
	audioPath = 'audio/' + lang + '/' + year + '/m/';
	imgPath = 'img/' + lang + '/' + year + '/m/';
	for(let i = 1; i <= m_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнитель', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_f'));
	audioPath = 'audio/' + lang + '/' + year + '/f/';
	imgPath = 'img/' + lang + '/' + year + '/f/';
	for(let i = 1; i <= f_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнительница', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	result = result.flat();
	shuffle(result);
	songs = result.slice(0, 20);
	answers = songs.map(item=>item.group);
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	showGroupNames();
}
	
function setMusicalAlphabetPack(arr, type, audioPath, imgPath){
	shuffle(arr);
	arr = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let group = arr[0].group;
	let result = [];
	result.push(arr[0]);
	for(let i = 1; i < arr.length; i++){
		if(group == arr[i].group){
			continue;
		} else {
			group = arr[i].group;
			result.push(arr[i]);
		}
	}
	result.forEach(song => {
		song.letter = Array.from(song.group)[0];
		song.type = type;
		song.audioPath = audioPath + song.id;
		song.imgPath = imgPath + song.group;
	});
	return result;
}

function generateSongIds(arr){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
	}
	return arr;
}

let back;
let expressMode = false;
let generateSongs;
let generateArr;
let generateAudioPath;
let generateImgPath;

function setup(){
	lang = 'en';
	year = '2010';
	artist_type = 'm';
	modeToggle = toggleArtist;
	setMedia = setAudio;
	rightAnswer = rightAnswer_RU;
	count_time();
	package_names = en_2010_m_icon;
	show_packages(package_names.length);
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	useUrlParam();
}

let pack_num;
let year_url = 'https://sunquiz.netlify.app/2010';

function useUrlParam() {
	var url_string = window.location.href; 
	var url = new URL(url_string);
	pack_num = url.searchParams.get("pack");
	if(pack_num){
		package_num(pack_num);
	}
	back = back_to_browser;
}

function back_to_browser(){
	window.location.href = year_url;
}

function back_to_current_pack(){
	back = back_to_browser;
	$('#mapping_content').hide();
	$('#sec_15_hist').hide();
	song_stop();
	$('#map').show();
	package_num(pack_num);
}

function song_stop() {
	if(audio){
		audio.pause();
		audio = null;
	}
}