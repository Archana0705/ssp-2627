let languageContent = {
  "en": {
      "dashboard-link"      : 'Dashboard',
      'student-management'  : 'Student Management',
      'student_scholarship-apply' : 'Student Scholarship Apply',
      "applied-schemes-link": 'Applied Schemes',
      "all-schemes-link"    : 'All Schemes',
      "student-details"     : ' Student Details',
      "eligibility-schemes" : 'Eligibility Schemes',
      "beneficiary-management" : "Student Management",
      "search-text" : 'Search',
      "all-scheme-text" : 'All Scheme',
      'fee-list'        : 'Fee',
      'fee-report'      : 'Fees Report',
      "institute-report-text" : 'Institute Report',
      "institute-dashboard-text" : 'Institute Dashboard',
      "academic-year-text" : 'Academic Year',
      "scheme-name-text" : 'Scheme Name',
      "sub-scheme-name-text" : 'Sub Scheme Name',
      "stream-text" : 'Stream',
      "course-type-text" : 'Course Type',
      "course-category-text" : 'Course Category',
      "course-text" : 'Course',
      "branch-text" : 'Branch',
      "course-year-text" : 'Course Year',
      "status-text" : 'Status',
      "gender-text" : 'Gender',

      // Department
      "scheme-list"      : 'Scheme List',
      "scheme-management": 'Scheme Management',
      "payment"          : 'Payment',
      "logout"           : 'Logout',
      "add-scheme"       : 'Add Scheme',
      "payment-dashboard": 'Payment Dashboard',
      "admin-report"     : 'Admin Report',
      "scheme-wise-report": 'Scheme Wise Report',
      "institute-report" : 'Institute Report',
      "change-password"  : 'Change Password'
  },
  "ta": {
      "dashboard-link"      : 'தகவல் பலகை',
      'student-management'  : 'மாணவர் நிர்வாகம்',
      'student_scholarship-apply' : 'மாணவர்கள் உதவித்தொகை விண்ணப்பம்',
      "applied-schemes-link": 'பயன்படுத்தப்பட்ட திட்டங்கள்',
      "all-schemes-link"    : 'அனைத்து திட்டங்கள்',
      "student-details"     : ' மாணவர் விவரங்கள்',
      "eligibility-schemes" : 'தகுதி திட்டங்கள்',
      "beneficiary-management" : 'பயனாளி மேலாண்மை',
      "search-text" : 'தேடல்',
      "all-scheme-text" : 'அனைத்து திட்டம்',
      'fee-list'        : 'கட்டண பட்டியல்',
      'fee-report'      : 'கட்டண அறிக்கை',
      "institute-report-text" : 'நிறுவன அறிக்கை',
      "institute-dashboard-text" : 'நிறுவன தகவல் பலகை',
      "academic-year-text" : 'கல்வி ஆண்டு',
      "scheme-name-text" : 'திட்டத்தின் பெயர்',
      "sub-scheme-name-text" : 'துணைத் திட்டத்தின் பெயர்',
      "stream-text" : 'ஸ்ட்ரீம்',
      "course-type-text" : 'பாட வகை',
      "course-category-text" : 'பாடப்பிரிவு',
      "course-text" : 'பாடநெறி',
      "branch-text" : 'கிளை',
      "course-year-text" : 'பாடநெறி ஆண்டு',
      "status-text" : 'நிலை',
      "gender-text" : 'பாலினம்',

      // Department
      "scheme-list"      : 'திட்டத்தின் பட்டியல்',
      "scheme-management": 'திட்டத்தின் மேலாண்மை',
      "payment"          : 'கட்டணம்',
      "logout"           : 'வெளியேறுதல்',
      "add-scheme"       : 'திட்டத்தைச் சேர்க்கவும்',
      "payment-dashboard": 'கட்டண தகவல்',
      "admin-report"     : 'நிர்வாக அறிக்கை',
      "scheme-wise-report": 'திட்ட வாரியான அறிக்கை',
      "institute-report" : 'நிறுவனம் அறிக்கை',
      "change-password"  : 'கடவுச்சொல்லை மாற்றவும்'

  }
};

// Check if 'language' is already set in localStorage
if (window.localStorage.getItem('language') === null) {
  // Set default language if not set (e.g., 'en')
  window.localStorage.setItem('language', 'en');
}

// Get the current language from localStorage
let currentLang = window.localStorage.getItem('language');

// Function to update UI based on current language
function updateUI() {
  // Select all elements with the 'data-i18n' attribute
  const elements = document.querySelectorAll('[data-i18n]');

  // Update text content for the elements based on the current language
  elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (languageContent[currentLang][key]) {
          el.textContent = languageContent[currentLang][key];
      }
  });

  // Update the language toggle button text
  document.getElementById('langToggle').textContent = currentLang === 'en' ? "  தமிழ்" : "  English";
}

// Function to switch language
function switchLang() {
  // Toggle the current language
  currentLang = currentLang === 'en' ? 'ta' : 'en';
  
  // Update localStorage with the new language
  window.localStorage.setItem('language', currentLang);
  
  // Update the UI with the new language
  updateUI();
}

// Call updateUI on page load to set the correct language
updateUI();
