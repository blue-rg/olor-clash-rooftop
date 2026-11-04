/* COLOR CLASH · Firebase 설정 (한 곳만 수정하면 됩니다).
   apiKey가 비어 있으면 AI 연습 모드로 자동 실행됩니다.
   기존 math641 프로젝트의 웹 앱 설정에 표시된 apiKey를 아래에 붙여 넣으세요. */
window.COLOR_CLASH_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBq5QGwlJcbS7-HhLQsAf7vZ9L59k7pnaQ',
  authDomain: 'math641.firebaseapp.com',
  databaseURL: 'https://math641-default-rtdb.firebaseio.com',
  projectId: 'math641',
  appId: '1:1098173968851:web:657ff1df9b17bcef7d7f26'
};
window.COLOR_CLASH_APP_URL = location.origin + location.pathname;
window.COLOR_CLASH_ROOM = new URLSearchParams(location.search).get('room') || '';
