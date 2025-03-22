import { ErrorMessage } from './validation_message.js';

// 비밀번호 표시/숨김 눈아이콘
document.querySelectorAll('.toggle-password').forEach(button => {
  button.addEventListener('click', () => {
    const input = document.getElementById(button.getAttribute('data-target'));
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    button.classList.toggle('show-password-icon');
    button.classList.toggle('hide-password-icon');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('myForm');
  const signupForm = document.getElementById('myFormSignUp');
  const isLoginPage = loginForm !== null;
  const isSignupPage = signupForm !== null;
  const form = isLoginPage ? loginForm : signupForm;

  if (!form) return; 
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitButton = form.querySelector(isLoginPage ? '.login' : '.sigup');
  
  // 회원가입 페이지에서만 필요한 요소들
  let nicknameInput, confirmPasswordInput;
  if (isSignupPage) {
    nicknameInput = document.getElementById('nickname');
    confirmPasswordInput = document.getElementById('confirmPassword');
  }
  
  // 에러 메시지 표시 함수
  function showError(input, message) {
    input.style.borderColor = 'red';
    
    // 기존 에러 메시지 삭제
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
    
    // 새 에러 메시지 생성하고 표시
    const newErrorElement = document.createElement('p');
    newErrorElement.className = 'error-message';
    newErrorElement.textContent = message;
    newErrorElement.style.color = 'red';
    newErrorElement.style.margin = '5px 0 0 0';
    newErrorElement.style.display = 'block';
    
    input.parentElement.appendChild(newErrorElement);
  }
  
  // 에러 메시지 제거 함수
  function removeError(input) {
    // 테두리 색상 원래대로
    input.style.borderColor = '';
    
    // 에러 메시지 삭제
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  // 이메일 유효성 검사 (validity.valid 사용)
  function checkEmail() {
    emailInput.type = 'email'; // 타입을 명확히 email로 설정
    const value = emailInput.value.trim();
    removeError(emailInput);
    if (value === '') {
      showError(emailInput, ErrorMessage.emailRequired);
      return false;
    }
    // HTML5 내장 이메일 유효성 검사 사용
    if (!emailInput.validity.valid) {
      showError(emailInput, ErrorMessage.invalidEmail);
      return false;
    }
    return true;
  }
  
  // 비밀번호 유효성 검사
  function checkPassword() {
    const value = passwordInput.value.trim();
    
    removeError(passwordInput);
    
    if (value === '') {
      showError(passwordInput, ErrorMessage.passwordRequired);
      return false;
    }
    
    if (value.length < 8) {
      showError(passwordInput, ErrorMessage.passwordLength);
      return false;
    }
    
    return true;
  }
  
  // 닉네임 유효성 검사 (회원가입 페이지에서만)
  function checkNickname() {
    if (!isSignupPage) return true;
    
    const value = nicknameInput.value.trim();
    
    removeError(nicknameInput);
    
    if (value === '') {
      showError(nicknameInput, ErrorMessage.nicknameRequired);
      return false;
    }
    
    return true;
  }
  
  // 비밀번호 확인 유효성 검사 (회원가입 페이지에서만)
  function checkConfirmPassword() {
    if (!isSignupPage) return true;
    
    const confirmValue = confirmPasswordInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    
    removeError(confirmPasswordInput);
    
    if (confirmValue === '') {
      showError(confirmPasswordInput, ErrorMessage.confirmPasswordRequired);
      return false;
    }
    
    if (confirmValue !== passwordValue) {
      showError(confirmPasswordInput, ErrorMessage.passwordMismatch);
      return false;
    }
    
    return true;
  }
  
  // 버튼 상태 업데이트 함수
  function updateButtonState() {
    // 에러 메시지가 있는지 확인
    const hasError = form.querySelector('.error-message') !== null;
    
    // 모든 필수 필드가 채워졌는지 확인
    let allFieldsFilled = emailInput.value.trim() !== '' && passwordInput.value.trim() !== '' && passwordInput.value.trim().length >= 8;
    
    // 회원가입 페이지에서는 추가 필드 확인
    if (isSignupPage) {
      allFieldsFilled = allFieldsFilled && nicknameInput.value.trim() !== '' && confirmPasswordInput.value.trim() !== '';
    }
    
    // 버튼 상태 설정
    if (!hasError && allFieldsFilled) {
      submitButton.disabled = false;
      submitButton.title = isLoginPage ? '로그인 가능상태' : '회원가입 가능상태';
      submitButton.textContent = isLoginPage ? '로그인' : '회원가입';
    } else {
      submitButton.disabled = true;
      submitButton.title = isLoginPage ? '정확한 로그인 정보를 입력하세요' : '정확한 회원가입 정보를 입력하세요';
      submitButton.textContent = isLoginPage ? '로그인' : ' 회원가입';
    }
  }
  
  // 입력 필드에 이벤트 리스너 등록
  emailInput.addEventListener('blur', checkEmail);
  emailInput.addEventListener('input', updateButtonState);  
  
  passwordInput.addEventListener('blur', checkPassword);
  passwordInput.addEventListener('input', () => {

    // 비밀번호 변경시 회원가입 페이지에서는 확인 필드도 체크
    if (isSignupPage && confirmPasswordInput.value.trim() !== '') {
      checkConfirmPassword();
    }
    updateButtonState();
  });
  
  // 회원가입 페이지에서만 추가 필드에 이벤트 리스너 등록
  if (isSignupPage) {
    nicknameInput.addEventListener('blur', checkNickname);
    nicknameInput.addEventListener('input', updateButtonState);
    
    confirmPasswordInput.addEventListener('blur', checkConfirmPassword);
    confirmPasswordInput.addEventListener('input', updateButtonState);
  }
  
  // 폼 제출 이벤트 처리
  form.addEventListener('submit', function(event) {
    event.preventDefault(); 
    if (isLoginPage) {
      const isEmailValid = checkEmail();
      const isPasswordValid = checkPassword();
      
      if (isEmailValid && isPasswordValid) {
        window.location.href = '../../html/items.html';
      }
    } 
 
    else if (isSignupPage) {
      const isEmailValid = checkEmail();
      const isNicknameValid = checkNickname();
      const isPasswordValid = checkPassword();
      const isConfirmPasswordValid = checkConfirmPassword();
      
      if (isEmailValid && isNicknameValid && isPasswordValid && isConfirmPasswordValid) {
        window.location.href = '../../html/login.html';
      }
    }
  });
  
  // 페이지 로드시 버튼 상태 초기화
  updateButtonState();
});