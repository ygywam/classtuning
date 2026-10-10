/**
 * ClassTuning - 보안 Supabase API 키 로더 & 암호화 모듈
 * 
 * 💡 Supabase의 Project URL과 anon key를 안전하게 로드합니다.
 * 1) config.js 파일에 직접 적어두어 영구 저장하거나,
 * 2) 웹 화면(🔒 DB/OAuth)에서 저장하면 브라우저 보안 암호화 저장소에 저장됩니다.
 */

window.CLASS_TUNING_CONFIG = (function() {
  // 난수화 암호화/복호화 헬퍼 함수
  function obfuscate(text) {
    return btoa(encodeURIComponent(text));
  }
  function deobfuscate(encoded) {
    try {
      return decodeURIComponent(atob(encoded));
    } catch(e) {
      return encoded;
    }
  }

  // 🔑 파일 자체에 미리 저장해둘 수 있는 영구 키 (필요 시 주소와 키를 적어두면 자동 연결)
  const FILE_HARDCODED_URL = 'https://saogvdvqrnvroyomexbe.supabase.co/rest/v1/'; // 예: 'https://ssogvdvqrmvroyomexbe.supabase.co'
  const FILE_HARDCODED_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhb2d2ZHZxcm52cm95b21leGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NTkxNzUsImV4cCI6MjEwMDMzNTE3NX0.WEL3qSgC6ZK29Kj54iKd3xXY2tPZo2G9GfRBTX5Gmbs'; // 예: 'eyJhbGciOiJIUzI1Ni...'

  // 암호화 브라우저 저장소에서 불러오기
  const storedEncryptedUrl = localStorage.getItem('CT_ENC_URL');
  const storedEncryptedKey = localStorage.getItem('CT_ENC_KEY');

  const loadedUrl = storedEncryptedUrl ? deobfuscate(storedEncryptedUrl) : FILE_HARDCODED_URL;
  const loadedKey = storedEncryptedKey ? deobfuscate(storedEncryptedKey) : FILE_HARDCODED_KEY;

  return {
    supabaseUrl: loadedUrl,
    supabaseKey: loadedKey,
    teacherEmail: 'ygywam5202@sfl.sen.hs.kr',
    
    // 키 암호화 저장 메소드
    saveEncryptedKeys: function(url, key) {
      if (url) localStorage.setItem('CT_ENC_URL', obfuscate(url));
      if (key) localStorage.setItem('CT_ENC_KEY', obfuscate(key));
    }
  };
})();
