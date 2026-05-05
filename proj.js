var correctUser = localStorage.getItem('profileUsername') || 'student';
var correctPass = localStorage.getItem('profilePassword') || 'ict9';

function loginUser(event){
  event.preventDefault();
  var username = document.getElementById('username').value.trim();
  var password = document.getElementById('password').value.trim();
  var message = document.getElementById('loginMessage');
  correctUser = localStorage.getItem('profileUsername') || 'student';
  correctPass = localStorage.getItem('profilePassword') || 'ict9';
  if(username === correctUser && password === correctPass){
    localStorage.setItem('portalUser', username);
    window.alert('Welcome to the Student Portal!');
    window.location.href = 'dashboard.html';
  } else {
    message.innerHTML = 'Wrong username or password. Try student / ict9, unless you changed it in Profile.';
  }
}

function checkLogin(){
  if(!localStorage.getItem('portalUser')){ window.location.href = 'index.html'; }
  applyProfileData();
}
function logoutUser(){ localStorage.removeItem('portalUser'); window.location.href = 'index.html'; }

function applyProfileData(){
  var display = localStorage.getItem('profileDisplay') || 'Grade 9 Student';
  var username = localStorage.getItem('profileUsername') || 'student';
  var savedPic = localStorage.getItem('profilePicture');

  var sideImage = document.getElementById('sideImage');
  var profileImage = document.getElementById('profileImage');
  var sideName = document.getElementById('sideName');
  var accountName = document.getElementById('accountName');
  var welcomeName = document.getElementById('welcomeName');

  if(savedPic && sideImage){ sideImage.src = savedPic; }
  if(savedPic && profileImage){ profileImage.src = savedPic; }
  if(sideName){ sideName.innerHTML = display; }
  if(accountName){ accountName.innerHTML = display; }
  if(welcomeName){ welcomeName.innerHTML = display + ' (@' + username + ')'; }
}


function quickSearch(){
  var box = document.getElementById('searchInput');
  var result = document.getElementById('searchResult');
  if(!box){return;}
  var search = box.value.toLowerCase();
  if(result){ result.innerHTML = search ? 'You searched for: <b>' + search + '</b>' : ''; }
  var cards = document.querySelectorAll('.big-card, .notebook-card, .task-card');
  for(var i=0; i<cards.length; i++){
    var text = cards[i].innerText.toLowerCase();
    if(search === '' || text.indexOf(search) > -1){ cards[i].classList.remove('hide-me'); }
    else{ cards[i].classList.add('hide-me'); }
  }
}

function loadDashboard(){
  checkLogin();
  var completed = parseInt(localStorage.getItem('completedTasks') || '0');
  var total = 4;
  var percent = Math.round((completed / total) * 100);
  document.getElementById('taskPercent').innerHTML = percent + '% done (' + completed + '/' + total + ' tasks)';
  var bar = document.getElementById('dashProgressBar');
  if(bar){ bar.style.width = percent + '%'; }
  var quotes = ['Small progress is still progress.','Study now, relax later.','Mistakes help us learn.','A notebook today can save your grade tomorrow.'];
  var day = new Date().getDay();
  document.getElementById('quoteText').innerHTML = quotes[day % quotes.length];
}

function buildCalendar(){
  checkLogin();
  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var today = new Date().getDate();
  var html = '<tr>';
  for(var d=0; d<days.length; d++){ html += '<th>' + days[d] + '</th>'; }
  html += '</tr><tr>';
  for(var i=1; i<=30; i++){
    var cls = (i === today) ? ' class="today-cell"' : '';
    html += '<td' + cls + ' onclick="calendarClick(' + i + ')">' + i + '</td>';
    if(i % 7 === 0 && i !== 30){ html += '</tr><tr>'; }
  }
  html += '</tr>';
  var calendar = document.getElementById('calendarBody');
  if(calendar){ calendar.innerHTML = html; }
}
function calendarClick(day){ window.alert('You clicked day ' + day + '. No class reminder added yet.'); }

function openNotebook(subject, pdfFile){
  var viewer = document.getElementById('pdfViewer');
  var frame = document.getElementById('lessonFrame');
  var title = document.getElementById('lessonTitle');
  var link = document.getElementById('lessonOpenLink');
  if(!viewer || !frame){
    window.alert('Opening ' + subject + ' notebook.');
    return;
  }
  title.innerHTML = subject + ' PDF Lesson';
  frame.src = 'lessons/' + pdfFile;
  link.href = 'lessons/' + pdfFile;
  viewer.style.display = 'block';
  viewer.scrollIntoView({behavior:'smooth'});
}
function closeLesson(){
  var viewer = document.getElementById('pdfViewer');
  var frame = document.getElementById('lessonFrame');
  if(frame){ frame.src = ''; }
  if(viewer){ viewer.style.display = 'none'; }
}

function takeActivity(taskName, btn){
  document.getElementById('taskOutput').innerHTML = 'Selected activity: <b>' + taskName + '</b>';
  if(btn){
    btn.disabled = true;
    btn.innerHTML = 'Finished';
    btn.parentElement.classList.add('task-done');
  }
  var done = document.querySelectorAll('.task-done').length;
  localStorage.setItem('completedTasks', done);
}
function clearTasks(){
  localStorage.setItem('completedTasks', '0');
  window.location.reload();
}

var secretNumber = Math.floor(Math.random() * 3) + 1;
function guessNumber(num){
  var output = document.getElementById('gameOutput');
  if(num === secretNumber){ output.innerHTML = 'Correct! You guessed the secret number.'; secretNumber = Math.floor(Math.random() * 3) + 1; }
  else{ output.innerHTML = 'Nope, try another number.'; }
}

function loadProfile(){
  checkLogin();
  applyProfileData();
  document.getElementById('profileUsername').value = localStorage.getItem('profileUsername') || 'student';
  document.getElementById('profileDisplay').value = localStorage.getItem('profileDisplay') || 'Grade 9 Student';
  document.getElementById('profilePassword').value = localStorage.getItem('profilePassword') || 'ict9';
  var savedPic = localStorage.getItem('profilePicture');
  if(savedPic){ document.getElementById('profileImage').src = savedPic; document.getElementById('sideImage').src = savedPic; }
  applyProfileData();
}
function saveProfile(){
  var username = document.getElementById('profileUsername').value.trim();
  var display = document.getElementById('profileDisplay').value.trim();
  var password = document.getElementById('profilePassword').value.trim();
  if(username === '' || password === ''){ document.getElementById('saveMessage').innerHTML = 'Username and password cannot be blank.'; return; }
  localStorage.setItem('profileUsername', username);
  localStorage.setItem('profileDisplay', display || 'Grade 9 Student');
  localStorage.setItem('profilePassword', password);
  localStorage.setItem('portalUser', username);
  applyProfileData();
  document.getElementById('saveMessage').innerHTML = 'Profile saved! It is now showing on every page.';
}
function previewPicture(input){
  if(input.files && input.files[0]){
    var reader = new FileReader();
    reader.onload = function(e){
      document.getElementById('profileImage').src = e.target.result;
      document.getElementById('sideImage').src = e.target.result;
      localStorage.setItem('profilePicture', e.target.result);
      applyProfileData();
    };
    reader.readAsDataURL(input.files[0]);
  }
}

document.addEventListener('DOMContentLoaded', function(){
  if(document.querySelector('.portal-layout')){ applyProfileData(); }
});
