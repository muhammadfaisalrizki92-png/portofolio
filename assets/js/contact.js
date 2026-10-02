/* ═══════════════════════════════════════════════ */
/* CONTACT.JS — Form Validation & Submission       */
/* ═══════════════════════════════════════════════ */

const Contact = (() => {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('contact-submit');
    const successMsg = document.getElementById('form-success');

    const errors = {
        name: document.getElementById('error-name'),
        email: document.getElementById('error-email'),
        message: document.getElementById('error-message'),
    };

    // ─── Validation Helpers ───
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(field, msg) {
        errors[field].textContent = msg;
        errors[field].classList.add('visible');
    }

    function clearError(field) {
        errors[field].textContent = '';
        errors[field].classList.remove('visible');
    }

    function clearAllErrors() {
        Object.keys(errors).forEach((key) => clearError(key));
    }

    // ─── Validate Form ───
    function validate() {
        let isValid = true;
        clearAllErrors();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!name) {
            showError('name', 'Nama wajib diisi.');
            isValid = false;
        } else if (name.length < 2) {
            showError('name', 'Nama minimal 2 karakter.');
            isValid = false;
        }

        if (!email) {
            showError('email', 'Email wajib diisi.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Format email tidak valid.');
            isValid = false;
        }

        if (!message) {
            showError('message', 'Pesan wajib diisi.');
            isValid = false;
        } else if (message.length < 10) {
            showError('message', 'Pesan minimal 10 karakter.');
            isValid = false;
        }

        return isValid;
    }

    // ─── Handle Submit ───
    function handleSubmit(e) {
        e.preventDefault();

        if (!validate()) return;

        // Simulate sending (replace with real API like Formspree/EmailJS)
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/></svg>
            Mengirim...
        `;

        // Build mailto fallback
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Use mailto as fallback
        const mailtoLink = `mailto:muhammadfaisalrizki0505@gmail.com?subject=Pesan dari ${encodeURIComponent(name)}&body=${encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\n${message}`)}`;

        setTimeout(() => {
            // Open mail client
            window.location.href = mailtoLink;

            // Show success
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            successMsg.classList.add('visible');
            form.reset();

            // Hide success after 5s
            setTimeout(() => {
                successMsg.classList.remove('visible');
            }, 5000);
        }, 800);
    }

    // ─── Real-time Validation (on blur) ───
    function setupLiveValidation() {
        nameInput.addEventListener('blur', () => {
            const val = nameInput.value.trim();
            if (!val) showError('name', 'Nama wajib diisi.');
            else if (val.length < 2) showError('name', 'Nama minimal 2 karakter.');
            else clearError('name');
        });

        emailInput.addEventListener('blur', () => {
            const val = emailInput.value.trim();
            if (!val) showError('email', 'Email wajib diisi.');
            else if (!isValidEmail(val)) showError('email', 'Format email tidak valid.');
            else clearError('email');
        });

        messageInput.addEventListener('blur', () => {
            const val = messageInput.value.trim();
            if (!val) showError('message', 'Pesan wajib diisi.');
            else if (val.length < 10) showError('message', 'Pesan minimal 10 karakter.');
            else clearError('message');
        });

        // Clear error on input
        nameInput.addEventListener('input', () => clearError('name'));
        emailInput.addEventListener('input', () => clearError('email'));
        messageInput.addEventListener('input', () => clearError('message'));
    }

    // ─── Init ───
    function init() {
        form.addEventListener('submit', handleSubmit);
        setupLiveValidation();
    }

    return { init };
})();
