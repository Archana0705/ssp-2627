const DropdownAPI = {
  getApiBase() {
    return (
      (window.config && config.secureApiBase) ||
      'http://192.168.4.251/state_scholarship_portal_api/ssp_3/public/api'
    );
  },

  getSchemeRegistrationBase() {
    return (
      (window.config && config.schemeRegistrationApiBase) ||
      'http://192.168.4.251/state_scholarship_portal_api/ssp_3/public/SchemeRegistration/api'
    );
  },

  async ensureCsrfToken() {
    const existing = sessionStorage.getItem('csrf_token');
    if (existing) return existing;

    const tokenRes = await fetch(`${this.getApiBase()}/getTOKENS`, { method: 'GET' });
    if (!tokenRes.ok) {
      throw new Error(`getTOKENS failed with status ${tokenRes.status}`);
    }

    const tokenJson = await tokenRes.json();
    const csrfToken =
      tokenJson?.csrf_token ||
      tokenJson?.data?.csrf_token ||
      tokenJson?.csrfToken ||
      tokenJson?.data?.csrfToken ||
      '';

    if (!csrfToken) {
      throw new Error('csrf_token not present in getTOKENS response');
    }

    sessionStorage.setItem('csrf_token', csrfToken);
    return csrfToken;
  },

  async post(endpoint, data = {}) {
    if (typeof SecureAPI === 'undefined' || !SecureAPI.request) {
      throw new Error('SecureAPI.request is unavailable');
    }

    await this.ensureCsrfToken();
    return SecureAPI.request(`${this.getApiBase()}/${endpoint}`, 'POST', data);
  },
  async get(endpoint, data = {}) {
    if (typeof SecureAPI === 'undefined' || !SecureAPI.request) {
      throw new Error('SecureAPI.request is unavailable');
    }

    await this.ensureCsrfToken();
    return SecureAPI.request(`${this.getSchemeRegistrationBase()}/${endpoint}`, 'GET', data);
  },

  extractRows(response) {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.data)) return response.data.data;
    if (Array.isArray(response.result)) return response.result;
    if (response.result && Array.isArray(response.result.data)) return response.result.data;
    if (Array.isArray(response.departments)) return response.departments;
    if (Array.isArray(response.subDepartments)) return response.subDepartments;
    if (Array.isArray(response.sub_departments)) return response.sub_departments;
    if (response.payload && Array.isArray(response.payload.data)) return response.payload.data;
    if (Array.isArray(response.items)) return response.items;
    if (Array.isArray(response.list)) return response.list;
    if (Array.isArray(response.records)) return response.records;
    if (Array.isArray(response.scheme_types)) return response.scheme_types;
    if (Array.isArray(response.exclusive_to)) return response.exclusive_to;
    if (Array.isArray(response.scheme_categories)) return response.scheme_categories;
    if (Array.isArray(response.dropdownData)) return response.dropdownData;
    return [];
  },

  bindSelectOptions(selector, rows, { valueKeys, textKeys, placeholderText = '--Select--' }) {
    const $select = $(selector);
    if (!$select.length) return;

    $select.empty();
    $select.append(new Option(placeholderText, '0'));

    rows.forEach((row) => {
      if (!row || typeof row !== 'object') return;
      const value = valueKeys.map((k) => row[k]).find((v) => v !== undefined && v !== null && String(v).trim() !== '');
      const rawLabel = textKeys.map((k) => row[k]).find((v) => v !== undefined && v !== null && String(v).trim() !== '');
      const text = rawLabel !== undefined ? String(rawLabel).trim() : '';
      if (value !== undefined && value !== null && text) {
        $select.append(new Option(text, String(value)));
      }
    });
  },

  async loadSubDepartments(selector, payload = {}) {
    const response = await this.post('subdepartment-filter', payload);
    console.log('subdepartment-filter decrypted response:', response);

    const rows = this.extractRows(response);
    console.log('subdepartment-filter rows for binding:', rows);
    this.bindSelectOptions(selector, rows, {
      valueKeys: ['subdepartment_id', 'id', 'sub_department_id'],
      textKeys: ['subdepartment_name', 'sub_department_name', 'name']
    });

    return rows;
  },

  /**
   * Scheme type dropdown from staging_api.php:
   * POST /api/scheme-type-filter (Auth + CSRF + encrypted payload)
   */
  async loadSchemeRegistrationDropdown(selector, typeParam = 'SchemeType') {
    if (typeof SecureAPI === 'undefined' || !SecureAPI.request) {
      throw new Error('SecureAPI.request is unavailable');
    }

    await this.ensureCsrfToken();

    const payload = { type: typeParam };
    console.log('scheme-type-filter payload:', payload);
    const response = await this.post('scheme-type-filter', payload);

    console.log(`scheme-registration dropdown [type=${typeParam}] response:`, response);

    const rows = this.extractRows(response);
    console.log(`scheme-registration dropdown [type=${typeParam}] rows:`, rows);

    this.bindSelectOptions(selector, rows, {
      valueKeys: ['id', 'value', 'scheme_type_id', 'type_id', 'lookup_id'],
      textKeys: ['display_text', 'displayText', 'name', 'text', 'label', 'scheme_type_name', 'type_name', 'description']
    });

    return rows;
  },

  async loadSchemeRegistrationGenericDropdown(selector, typeParam, bindConfig = {}) {
    const endpoint = bindConfig.endpoint || 'dropdown';
    const payload = {
      type: typeParam,
      ...(bindConfig.payload || {})
    };

    return this.loadDropdown({
      endpoint,
      selector,
      payload,
      method: 'get',
      valueKeys: bindConfig.valueKeys || ['id', 'value', 'lookup_id', 'type_id'],
      textKeys: bindConfig.textKeys || ['display_text', 'displayText', 'name', 'text', 'label', 'description'],
      placeholderText: bindConfig.placeholderText || '--Select--',
      renderType: bindConfig.renderType || 'select',
      includeNA: bindConfig.includeNA ?? false,
      useSelect2: bindConfig.useSelect2 ?? false,
      extraOptions: bindConfig.extraOptions || []
    });
  },


  // ========================================================================================================================
  // ************************************************************************************************************************
  //                                          ELIGIBILITY TAP API
  // ************************************************************************************************************************
  // ========================================================================================================================


  async loadDropdown({
    endpoint,
    selector,
    payload = {},
    method,
    valueKeys = ['id'],
    textKeys = ['name'],
    placeholderText = '--Select--',
    renderType = 'select',
    constraint = '',
    field = '',
    includeNA = true,
    useSelect2 = false,
    extraOptions = []
  }) {
    let response;
    if (method === 'get') {
      response = await this.get(endpoint, payload);
    } else {
      response = await this.post(endpoint, payload);
    }
    // const response = await this.post(endpoint, payload);
    const rows = this.extractRows(response) || [];

    // ✅ Inject NA
    let finalRows = rows;
    if (includeNA) {
      const hasNA = rows.some(item =>
        valueKeys.some(k => String(item[k]) === '-1')
      );

      if (!hasNA) {
        const naObj = {};
        valueKeys.forEach(k => naObj[k] = '-1');
        textKeys.forEach(k => naObj[k] = 'Not Applicable');

        finalRows = [naObj, ...rows];
      }
    }

    // ============================
    // 👉 SELECT (WITH SELECT2)
    // ============================
    if (renderType === 'select') {

      const $el = $(selector);

      if (useSelect2) {

        // 👉 destroy safely
        try {
          if ($el.data('select2')) $el.select2('destroy');
        } catch (e) { }

        $el.empty();

        // 👉 Add extra options first
        extraOptions.forEach(opt => {
          $el.append(new Option(opt.label, opt.value, false, false));
        });

        // 👉 Add actual data
        finalRows.forEach(item => {
          const value = valueKeys.map(k => item[k]).find(v => v !== undefined);
          const text = textKeys.map(k => item[k]).find(v => v !== undefined);

          $el.append(new Option(text, value, value === '-1', value === '-1'));
        });

        $el.prop('multiple', true);

        $el.select2({
          width: '100%',
          placeholder: placeholderText
        });

        // 👉 Special handling
        $el.off('change.control').on('change.control', function () {

          let values = $(this).val() || [];

          // Select All
          if (values.includes('select_all')) {
            const all = [];
            $(this).find('option').each(function () {
              const v = $(this).val();
              if (!['select_all', 'deselect_all'].includes(v)) {
                all.push(v);
              }
            });
            $(this).val(all).trigger('change.select2');
          }

          // Deselect All
          if (values.includes('deselect_all')) {
            $(this).val(['-1']).trigger('change.select2');
          }

          // NA logic
          if (values.includes('-1') && values.length > 1) {
            $(this).val(['-1']).trigger('change.select2');
          }
        });

      } else {
        // 👉 fallback (your existing)
        this.bindSelectOptions(selector, finalRows, {
          valueKeys,
          textKeys,
          placeholderText
        });
      }
    }

    // ============================
    // 👉 CHIP (UNCHANGED)
    // ============================
    if (renderType === 'chip') {
      let html = `
      <div class="chip-select multi-select" 
           data-group="${constraint}" 
           data-type="${field}">
    `;

      finalRows.forEach(item => {
        const value = valueKeys.map(k => item[k]).find(v => v !== undefined);
        const text = textKeys.map(k => item[k]).find(v => v !== undefined);

        const isNA = String(value) === '-1';

        html += `
        <label class="chip ${isNA ? 'active' : ''}">
          <input type="checkbox" 
                 value="${value}" 
                 ${isNA ? 'checked' : ''} 
                 hidden>
          <span>${text}</span>
        </label>
      `;
      });

      html += `</div>`;
      $(selector).html(html);
    }

    return finalRows;
  }
};

