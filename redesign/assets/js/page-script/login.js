$(document).ready(function () {
loadCaptcha();
    // LOGIN VALIDATION AND ERROR HANDLING
    let isSubmitting = false;
    let captchaData = null;
    let captchaToken = null;

    // Validation functions
    function validateUsername(username) {
        if (!username || username.trim() === '') {
            return 'Username is required';
        }
        if (username.length < 3) {
            return 'Username must be at least 3 characters long';
        }
        if (username.length > 50) {
            return 'Username must be less than 50 characters';
        }
        // Check for valid characters (alphanumeric, underscore, dash, dot)
        const usernameRegex = /^[a-zA-Z0-9._-]+$/;
        if (!usernameRegex.test(username)) {
            return 'Username can only contain letters, numbers, dots, underscores, and dashes';
        }
        return null;
    }

    function validatePassword(password) {
        if (!password || password.trim() === '') {
            return 'Password is required';
        }
        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        if (password.length > 128) {
            return 'Password must be less than 128 characters';
        }
        return null;
    }

    function validateCaptcha(captcha) {
        if (!captcha || captcha.trim() === '') {
            return 'Captcha is required';
        }
        if (captcha.length < 4) {
            return 'Captcha must be at least 4 characters long';
        }
        if (captcha.length > 10) {
            return 'Captcha must be less than 10 characters';
        }
        return null;
    }

    function showError(message, fieldId = null) {
        // Remove any existing error messages
        $('.error-message').remove();
        $('.form-control').removeClass('is-invalid');

        if (fieldId) {
            $(`#${fieldId}`).addClass('is-invalid');
            $(`#${fieldId}`).after(`<div class="error-message text-danger small mt-1">${message}</div>`);
        } else {
            // Show general error message
            const alertHtml = `
                <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            $('#loginBtn').after(alertHtml);
        }
    }

    function showSuccess(message) {
        const alertHtml = `
            <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        $('#loginBtn').after(alertHtml);
    }

    function setLoading(loading) {
        isSubmitting = loading;
        const btn = $('#loginBtn');
        const icon = btn.find('i');

        if (loading) {
            btn.prop('disabled', true);
            btn.html('<span class="spinner-border spinner-border-sm me-2" role="status"></span>Signing in...');
            $('#username, #password, #captcha').prop('disabled', true);
        } else {
            btn.prop('disabled', false);
            btn.html('Sign in <i class="bi bi-box-arrow-in-right"></i>');
            $('#username, #password, #captcha').prop('disabled', false);
        }
    }

    function sanitizeInput(input) {
        return input.trim().replace(/[<>]/g, '');
    }

    // Form validation on input change
    $('#username, #password, #captcha').on('input', function() {
        const field = $(this);
        field.removeClass('is-invalid');
        field.next('.error-message').remove();
    });

    async function attemptLogin(username, password, captcha, forceLogin = false) {
        return $.ajax({
            url: `${API_BASE_URL}/login`,
            method: 'POST',
            contentType: 'application/json',
            timeout: 30000, // 30 second timeout
            data: JSON.stringify({ username, password, captcha, token: captchaToken, force_login: forceLogin })
        });
    }

    // LOGIN
    $('#loginBtn').on('click', async function (e) {
        e.preventDefault();

        if (isSubmitting) return;

        // Clear previous errors
        $('.error-message').remove();
        $('.form-control').removeClass('is-invalid');
        $('.alert').remove();

        const username = sanitizeInput($('#username').val());
        const password = $('#password').val(); // Don't sanitize password as it might contain special chars
        const captcha = sanitizeInput($('#captcha').val());

        // Client-side validation
        const usernameError = validateUsername(username);
        if (usernameError) {
            showError(usernameError, 'username');
            $('#username').focus();
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            showError(passwordError, 'password');
            $('#password').focus();
            return;
        }

        const captchaError = validateCaptcha(captcha);
        if (captchaError) {
            showError(captchaError, 'captcha');
            $('#captcha').focus();
            return;
        }

        setLoading(true);
       
        try {
            let response;
            try {
                response = await attemptLogin(username, password, captcha, false);
            } catch (firstAttemptError) {
                const isConcurrentLoginError = firstAttemptError?.status === 409;
                if (!isConcurrentLoginError) {
                    throw firstAttemptError;
                }

                const shouldForceLogin = window.confirm(
                    'You are already logged in on another device. Do you want to logout from other device and continue here?'
                );

                if (!shouldForceLogin) {
                    throw firstAttemptError;
                }

                response = await attemptLogin(username, password, captcha, true);
            }

            // Validate response structure
            if (!response || !response.access_token) {
                throw new Error('Invalid response from server');
            }

            // Success - Store tokens securely
            try {
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('refresh_token', response.refresh_token || '');
                sessionStorage.setItem('encryption_key', response.encryption_key || '');
                sessionStorage.setItem('csrf_token', response.csrf_token || '');
                sessionStorage.setItem('user_details', response.details || '');
            } catch (storageError) {
                console.warn('Storage error:', storageError);
                showError('Login successful but failed to store session data. Please try again.');
                setLoading(false);
                return;
            }

            showSuccess('Login successful! Redirecting...');

            // Small delay for user feedback
            setTimeout(() => {
                $('#secureArea').removeClass('d-none');
                window.location.href = 'landing.html';
            }, 1000);

        } catch (ex) {
            console.error('Login error:', ex);
            setLoading(false);

            let errorMsg = 'Login failed. Please try again.';

            if (ex.status) {
                switch (ex.status) {
                    case 400:
                        errorMsg = 'Invalid username or password. Please check your credentials.';
                        break;
                    case 401:
                        errorMsg = 'Invalid username or password. Please check your credentials.';
                        break;
                    case 403:
                        errorMsg = 'Account is disabled or access denied.';
                        break;
                    case 409:
                        errorMsg = 'A session is already active on another device.';
                        break;
                    case 429:
                        errorMsg = 'Too many login attempts. Please wait a few minutes before trying again.';
                        break;
                    case 500:
                        errorMsg = 'Server error. Please try again later.';
                        break;
                    case 503:
                        errorMsg = 'Service temporarily unavailable. Please try again later.';
                        break;
                    default:
                        if (ex.status >= 500) {
                            errorMsg = 'Server error. Please try again later.';
                        }
                }
            } else if (ex.statusText === 'timeout') {
                errorMsg = 'Request timed out. Please check your connection and try again.';
            } else if (!navigator.onLine) {
                errorMsg = 'No internet connection. Please check your network and try again.';
            }

            // Check for specific error messages from server
            if (ex.responseJSON && ex.responseJSON.error) {
                errorMsg = ex.responseJSON.error;
            } else if (ex.responseJSON && ex.responseJSON.message) {
                errorMsg = ex.responseJSON.message;
            }

            showError(errorMsg);
        }
    });

    // Allow login on Enter key press
    $('#username, #password, #captcha').on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            $('#loginBtn').click();
        }
    });


    // FETCH SECURE DATA
    $('#fetchBtn').on('click', async function () {
        const dataToSend = {
            info: $('#payloadData').val()
        };

        try {
            const result = await SecureAPI.request(
                `${API_BASE_URL}/secure-data`,
                'POST',
                dataToSend
            );

            $('#responseBox').text(JSON.stringify(result, null, 2));

        } catch (e) {
            console.error(e);
            alert('Error fetching secure data. Check console.');
        }
    });


    // LOGOUT
    $('#logoutBtn').on('click', async function () {
        try {
            await SecureAPI.request(
                `${API_BASE_URL}/logout`,
                'POST'
            );
        } catch (e) {
            console.warn('Logout API failed, continuing cleanup...');
        }

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.clear();
        location.reload();
    });


    function loadCaptcha() {
        $.ajax({
            url: API_BASE_URL + '/captcha',
            type: 'GET',
            headers: { 'X-APP-KEY': 'te$t', 'X-APP-NAME': 'te$t' },
            success: function(response) {
                captchaData = response.captcha || response;
                captchaToken = captchaData.token;
                $('#captcha-image').attr('src', captchaData.image);
            },
            error: function() {
                console.log('Error loading captcha.');
                showError('Failed to load captcha. Please refresh the page.');
            }
        });
    }

    // Refresh CAPTCHA on button click
    $('#refreshCaptcha').on('click', function() {
        loadCaptcha();
    });

});
