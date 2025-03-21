// 유효성 검사를 위한 에러 메시지 정의
const ErrorMessage = {
  emailRequired: '이메일을 입력해주세요.',
  invalidEmail: '잘못된 이메일 형식입니다.',
  nicknameRequired: '닉네임을 입력해주세요.',
  passwordRequired: '비밀번호를 입력해주세요.',
  passwordLength: '비밀번호를 8자 이상 입력해주세요.',
  passwordMismatch: '비밀번호가 일치하지 않습니다.',
  confirmPasswordRequired: '비밀번호를 다시 한번 입력해주세요.',
};

document.addEventListener('DOMContentLoaded', () => {
  // DOM 요소 선택 - 공통 요소
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  // 로그인 폼 관련 요소
  const loginForm = document.getElementById('myForm');
  const loginButton = loginForm ? loginForm.querySelector('.login') : null;
  
  // 회원가입 폼 관련 요소
  const signupForm = document.getElementById('myFormSignUp');
  const signupButton = signupForm ? signupForm.querySelector('.sigup') : null;
  const nicknameInput = document.getElementById('nickname');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
  // 현재 페이지가 로그인 페이지인지 회원가입 페이지인지 확인
  const isLoginPage = !!loginForm;
  const isSignupPage = !!signupForm;
  
  // 비밀번호 표시/숨김 토글 기능
  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.getAttribute('data-target'));
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      button.classList.toggle('show-password-icon');
      button.classList.toggle('hide-password-icon');
    });
  });
  
  // 이메일 유효성 검사 함수
  function validateEmail() {
    const email = emailInput.value.trim();
    
    // 기존 에러 메시지 제거
    removeError(emailInput);
    
    // 이메일이 비어있는 경우
    if (email === '') {
      showError(emailInput, ErrorMessage.emailRequired);
      return false;
    }
    
    // 이메일 형식 검사 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError(emailInput, ErrorMessage.invalidEmail);
      return false;
    }
    
    return true;
  }
  
  // 비밀번호 유효성 검사 함수
  function validatePassword() {
    const password = passwordInput.value.trim();
    
    // 기존 에러 메시지 제거
    removeError(passwordInput);
    
    if (password === '') {
      showError(passwordInput, ErrorMessage.passwordRequired);
      return false;
    }
    
    if (password.length < 8) {
      showError(passwordInput, ErrorMessage.passwordLength);
      return false;
    }
    
    return true;
  }
  
  // 닉네임 유효성 검사 함수 (회원가입 페이지에서만 사용)
  function validateNickname() {
    if (!nicknameInput) return true;
    
    const nickname = nicknameInput.value.trim();
    
    // 기존 에러 메시지 제거
    removeError(nicknameInput);
    
    // 닉네임이 비어있는 경우
    if (nickname === '') {
      showError(nicknameInput, ErrorMessage.nicknameRequired);
      return false;
    }
    
    return true;
  }
  
  // 비밀번호 확인 유효성 검사 함수 (회원가입 페이지에서만 사용)
  function validateConfirmPassword() {
    if (!confirmPasswordInput) return true;
    
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    
    // 기존 에러 메시지 제거
    removeError(confirmPasswordInput);
    
    // 비밀번호 확인이 비어있는 경우
    if (confirmPassword === '') {
      showError(confirmPasswordInput, ErrorMessage.confirmPasswordRequired);
      return false;
    }
    
    // 비밀번호와 비밀번호 확인이 일치하지 않는 경우
    if (password !== confirmPassword) {
      showError(confirmPasswordInput, ErrorMessage.passwordMismatch);
      return false;
    }
    
    return true;
  }
  
  // 에러 메시지 표시 함수
  function showError(input, message) {
    input.style.borderColor = 'red';
    
    // 기존 에러 메시지가 있으면 제거
    removeError(input);
    
    // 에러 메시지 요소 생성
    const errorElement = document.createElement('p');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.margin = '5px 0 0 0';
    errorElement.style.display = 'block';
    
    // 에러 메시지 표시
    input.parentElement.appendChild(errorElement);
    
    // 버튼 상태 업데이트
    updateButtonState();
  }
  
  // 에러 메시지 제거 함수
  function removeError(input) {
    input.style.borderColor = '';
    const container = input.parentElement;
    const errorElements = container.querySelectorAll('.error-message');
    errorElements.forEach(el => container.removeChild(el));
  }
  
  // 버튼 상태 업데이트 함수
  function updateButtonState() {
    const hasError = document.querySelector('.error-message') !== null;
    const isEmailEmpty = emailInput.value.trim() === '';
    const isPasswordEmpty = passwordInput.value.trim() === '';
    const isPasswordTooShort = passwordInput.value.trim().length < 8;
    
    // 로그인 버튼 상태 업데이트 (로그인 페이지에서만)
    if (isLoginPage && loginButton) {
      if (!hasError && !isEmailEmpty && !isPasswordEmpty && !isPasswordTooShort) {
        loginButton.disabled = false;
        loginButton.title = '로그인';
        loginButton.textContent = '로그인';
      } else {
        loginButton.disabled = true;
        loginButton.title = '선택안됨';
        loginButton.textContent = '로그인 준비중...';
      }
    }
    
    // 회원가입 버튼 상태 업데이트 (회원가입 페이지에서만)
    if (isSignupPage && signupButton) {
      const isNicknameEmpty = nicknameInput.value.trim() === '';
      const isConfirmPasswordEmpty = confirmPasswordInput.value.trim() === '';
      
      if (!hasError && !isEmailEmpty && !isNicknameEmpty && !isPasswordEmpty && 
          !isPasswordTooShort && !isConfirmPasswordEmpty) {
        signupButton.disabled = false;
        signupButton.title = '선택됨';
        signupButton.textContent = '회원가입';
      } else {
        signupButton.disabled = true;
        signupButton.title = '선택안됨';
        signupButton.textContent = '회원가입 준비중...';
      }
    }
  }
  
  // 이벤트 리스너 설정
  if (emailInput) {
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', updateButtonState);
  }
  
  if (passwordInput) {
    passwordInput.addEventListener('blur', validatePassword);
    passwordInput.addEventListener('input', () => {
      // 비밀번호가 변경되면, 회원가입 페이지에서는 비밀번호 확인도 다시 검증
      if (isSignupPage && confirmPasswordInput && confirmPasswordInput.value.trim() !== '') {
        validateConfirmPassword();
      }
      updateButtonState();
    });
  }
  
  if (nicknameInput) {
    nicknameInput.addEventListener('blur', validateNickname);
    nicknameInput.addEventListener('input', updateButtonState);
  }
  
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
    confirmPasswordInput.addEventListener('input', updateButtonState);
  }
  
  // 로그인 폼 제출 이벤트
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); // 기본 제출 동작 방지
      
      // 최종 유효성 검사
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();
      
      // 모든 입력이 유효한 경우 페이지 이동
      if (isEmailValid && isPasswordValid) {
        window.location.href = '../../html/items.html';
      }
    });
  }
  
  // 회원가입 폼 제출 이벤트
  if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
      event.preventDefault(); // 기본 제출 동작 방지
      
      // 폼 유효성 검사
      const isEmailValid = validateEmail();
      const isNicknameValid = validateNickname();
      const isPasswordValid = validatePassword();
      const isConfirmPasswordValid = validateConfirmPassword();
      
      // 모든 입력이 유효한 경우 페이지 이동
      if (isEmailValid && isNicknameValid && isPasswordValid && isConfirmPasswordValid) {
        window.location.href = '../../html/login.html';
      }
    });
  }
  
  // 초기 상태 설정
  updateButtonState();
});