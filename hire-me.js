// Hire Me Modal - 3-Step Flow
// Professional hiring flow for portfolio with service selection, form, and contact options

(() => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const state = {
    currentStep: 1,
    selectedService: null,
    formData: {}
  };

  // ============================================
  // FORM FIELD CONFIGURATIONS
  // Edit these to customize form fields for each service
  // ============================================
  const formFields = {
    branding: [
      {
        name: 'projectName',
        label: 'Business/Project Name',
        type: 'text',
        placeholder: 'e.g., Juba Cafe',
        required: true
      },
      {
        name: 'needs',
        label: 'What do you need?',
        type: 'select',
        options: ['Logo Design', 'Full Brand Kit', 'Rebranding', 'Brand Guidelines'],
        required: true
      },
      {
        name: 'deadline',
        label: 'Timeline',
        type: 'select',
        options: ['1-2 weeks', '1 month', '2-3 months', 'Flexible'],
        required: true
      },
      {
        name: 'budget',
        label: 'Budget Range',
        type: 'select',
        options: ['$5 - $100', '$100 - $200', '$200 - $500', '$500 - $1,000', '$1,000+'],
        required: true
      }
    ],
    'web-design': [
      {
        name: 'projectType',
        label: 'Project Type',
        type: 'select',
        options: ['Portfolio Website', 'Business Website', 'E-commerce Site', 'App UI/UX Design', 'Landing Page'],
        required: true
      },
      {
        name: 'projectName',
        label: 'Project Name',
        type: 'text',
        placeholder: 'e.g., My Portfolio',
        required: true
      },
      {
        name: 'deadline',
        label: 'Timeline',
        type: 'select',
        options: ['1-2 weeks', '1 month', '2-3 months', 'Flexible'],
        required: true
      },
      {
        name: 'budget',
        label: 'Budget Range',
        type: 'select',
        options: ['$200 - $500', '$500 - $1,000', '$1,000 - $2,000', '$2,000+'],
        required: true
      }
    ],
    custom: [
      {
        name: 'projectDescription',
        label: 'Project Description',
        type: 'textarea',
        placeholder: 'Tell me about your project...',
        required: true,
        rows: 4
      },
      {
        name: 'meetingMethod',
        label: 'Preferred Contact Method',
        type: 'radio',
        options: ['WhatsApp Call', 'Video Meeting', 'Phone Call', 'Email Discussion'],
        required: true
      },
      {
        name: 'deadline',
        label: 'Timeline (Optional)',
        type: 'select',
        options: ['As soon as possible', '1-2 weeks', '1 month', '2-3 months', 'No rush'],
        required: false
      }
    ]
  };

  // Service names for display
  const serviceNames = {
    'branding': 'Branding & Visual Identity',
    'web-design': 'Website/App Design',
    'custom': 'Custom Project / Consultation'
  };

  // ============================================
  // DOM ELEMENTS
  // ============================================
  const modal = document.getElementById('hireMeModal');
  const hireMeBtn = document.getElementById('hireMeBtn');
  const closeBtn = modal?.querySelector('.hire-modal-close');
  const overlay = modal?.querySelector('.hire-modal-overlay');
  const backBtn = modal?.querySelector('.hire-back-btn');
  const submitBtn = document.getElementById('hireFormSubmit');
  const newInquiryBtn = modal?.querySelector('.hire-new-inquiry');
  
  // ============================================
  // MODAL CONTROL FUNCTIONS
  // ============================================
  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetFlow();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function resetFlow() {
    state.currentStep = 1;
    state.selectedService = null;
    state.formData = {};
    showStep(1);
    updateProgress();
  }

  // ============================================
  // STEP NAVIGATION
  // ============================================
  function showStep(stepNumber) {
    const steps = modal.querySelectorAll('.hire-step');
    steps.forEach(step => {
      step.style.display = step.dataset.step === String(stepNumber) ? 'block' : 'none';
    });
    state.currentStep = stepNumber;
    updateProgress();
  }

  function updateProgress() {
    const progressSteps = modal.querySelectorAll('.hire-progress-step');
    progressSteps.forEach(step => {
      const stepNum = parseInt(step.dataset.step);
      if (stepNum < state.currentStep) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else if (stepNum === state.currentStep) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });
  }

  function goToStep(stepNumber) {
    showStep(stepNumber);
  }

  // ============================================
  // SERVICE SELECTION (STEP 1)
  // ============================================
  function handleServiceSelection(serviceType) {
    state.selectedService = serviceType;
    buildForm(serviceType);
    goToStep(2);
  }

  // ============================================
  // FORM BUILDER (STEP 2)
  // ============================================
  function buildForm(serviceType) {
    const form = document.getElementById('hireForm');
    if (!form) return;

    const fields = formFields[serviceType];
    form.innerHTML = '';

    fields.forEach(field => {
      const fieldWrapper = document.createElement('div');
      fieldWrapper.className = 'hire-form-group';

      const label = document.createElement('label');
      label.className = 'hire-form-label';
      label.textContent = field.label;
      if (field.required) {
        const required = document.createElement('span');
        required.className = 'required';
        required.textContent = '*';
        label.appendChild(required);
      }
      fieldWrapper.appendChild(label);

      let input;

      switch (field.type) {
        case 'text':
          input = document.createElement('input');
          input.type = 'text';
          input.name = field.name;
          input.placeholder = field.placeholder || '';
          input.className = 'hire-form-input';
          input.required = field.required;
          fieldWrapper.appendChild(input);
          break;

        case 'textarea':
          input = document.createElement('textarea');
          input.name = field.name;
          input.placeholder = field.placeholder || '';
          input.className = 'hire-form-input';
          input.rows = field.rows || 4;
          input.required = field.required;
          fieldWrapper.appendChild(input);
          break;

        case 'select':
          input = document.createElement('select');
          input.name = field.name;
          input.className = 'hire-form-input';
          input.required = field.required;
          
          const defaultOption = document.createElement('option');
          defaultOption.value = '';
          defaultOption.textContent = `Select ${field.label.toLowerCase()}...`;
          input.appendChild(defaultOption);

          field.options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            input.appendChild(opt);
          });
          fieldWrapper.appendChild(input);
          break;

        case 'radio':
          const radioGroup = document.createElement('div');
          radioGroup.className = 'hire-radio-group';
          field.options.forEach((option, index) => {
            const radioWrapper = document.createElement('label');
            radioWrapper.className = 'hire-radio-label';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = field.name;
            radio.value = option;
            radio.required = field.required && index === 0;
            
            const radioText = document.createElement('span');
            radioText.textContent = option;
            
            radioWrapper.appendChild(radio);
            radioWrapper.appendChild(radioText);
            radioGroup.appendChild(radioWrapper);
          });
          fieldWrapper.appendChild(radioGroup);
          break;
      }

      form.appendChild(fieldWrapper);
    });
  }

  // ============================================
  // FORM VALIDATION & SUBMISSION (STEP 2 → 3)
  // ============================================
  function handleFormSubmit(e) {
    e?.preventDefault();
    
    const form = document.getElementById('hireForm');
    if (!form) return;

    // Check if form is valid
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Collect form data
    const formElements = form.elements;
    state.formData = {};

    for (let element of formElements) {
      if (element.name) {
        if (element.type === 'radio') {
          if (element.checked) {
            state.formData[element.name] = element.value;
          }
        } else {
          state.formData[element.name] = element.value;
        }
      }
    }

    // Build summary and contact links
    buildSummary();
    buildContactLinks();
    
    // Go to step 3
    goToStep(3);
  }

  // ============================================
  // SUMMARY BUILDER (STEP 3)
  // ============================================
  function buildSummary() {
    const summaryContainer = document.getElementById('hireSummary');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = `
      <div class="summary-item">
        <span class="summary-label">Service:</span>
        <span class="summary-value">${serviceNames[state.selectedService]}</span>
      </div>
    `;

    // Add form data to summary
    Object.entries(state.formData).forEach(([key, value]) => {
      if (value) {
        const label = key.replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .replace(/^Project/, 'Project:');
        
        summaryContainer.innerHTML += `
          <div class="summary-item">
            <span class="summary-label">${label}:</span>
            <span class="summary-value">${value}</span>
          </div>
        `;
      }
    });
  }

  // ============================================
  // CONTACT LINKS BUILDER
  // ============================================
  function buildContactLinks() {
    const serviceName = serviceNames[state.selectedService];
    
    // Build message text
    let message = `Hi Mathew, I'm interested in working with you on:\n\n`;
    message += `• Service: ${serviceName}\n`;
    
    Object.entries(state.formData).forEach(([key, value]) => {
      if (value) {
        const label = key.replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        message += `• ${label}: ${value}\n`;
      }
    });
    
    message += `\nLet's chat!`;

    // WhatsApp link
    const whatsappNumber = '211922931515'; 
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) whatsappBtn.href = whatsappUrl;

    // Email link
    const emailSubject = `Project Inquiry — ${serviceName}`;
    const emailBody = message;
    const emailUrl = `mailto:info@mathewyel.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    const emailBtn = document.getElementById('emailBtn');
    if (emailBtn) emailBtn.href = emailUrl;
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  function initEventListeners() {
    // Open modal
    hireMeBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });

    // Close modal
    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('active')) {
        closeModal();
      }
    });

    // Service selection
    const serviceCards = modal?.querySelectorAll('.hire-service-card');
    serviceCards?.forEach(card => {
      card.addEventListener('click', () => {
        const service = card.dataset.service;
        handleServiceSelection(service);
      });
    });

    // Back button
    backBtn?.addEventListener('click', () => {
      goToStep(1);
    });

    // Form submit
    submitBtn?.addEventListener('click', handleFormSubmit);

    // New inquiry
    newInquiryBtn?.addEventListener('click', () => {
      resetFlow();
    });
  }

  // ============================================
  // INITIALIZE
  // ============================================
  if (modal && hireMeBtn) {
    initEventListeners();
  }
})();
