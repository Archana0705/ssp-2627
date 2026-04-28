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

  async postToUrl(url, data = {}) {
    if (typeof SecureAPI === 'undefined' || !SecureAPI.request) {
      throw new Error('SecureAPI.request is unavailable');
    }

    await this.ensureCsrfToken();
    return SecureAPI.request(url, 'POST', data);
  },

  async getWithEncryptedPayload(url, data = {}) {
    if (typeof SecureAPI === 'undefined' || !SecureAPI.encrypt || !SecureAPI.decrypt) {
      throw new Error('SecureAPI encrypt/decrypt is unavailable');
    }

    await this.ensureCsrfToken();

    const token = localStorage.getItem('access_token');
    const encryptionKey = sessionStorage.getItem('encryption_key');
    const csrfToken = sessionStorage.getItem('csrf_token');

    if (!encryptionKey) {
      throw new Error('encryption_key is missing in sessionStorage');
    }

    const encryptedPayload = SecureAPI.encrypt(JSON.stringify(data), encryptionKey);
    const urlWithPayload = `${url}?${new URLSearchParams({ payload: encryptedPayload })}`;

    const response = await fetch(urlWithPayload, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-CSRF-Token': csrfToken
      }
    });

    const result = await response.json();
    if (result?.payload) {
      const decrypted = SecureAPI.decrypt(result.payload, encryptionKey);
      return JSON.parse(decrypted);
    }

    return result;
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
    if (typeof SecureAPI === 'undefined' || !SecureAPI.request) {
      throw new Error('SecureAPI.request is unavailable');
    }

    await this.ensureCsrfToken();

    const endpoint = bindConfig.endpoint || 'dropdown';
    const payload = {
      type: typeParam,
      ...(bindConfig.payload || {})
    };
    const base = this.getSchemeRegistrationBase().replace(/\/$/, '');
    const url = `${base}/${endpoint}`;
    console.log(`scheme-registration GET encrypted payload [url=${url}]`, payload);

    let response = await this.getWithEncryptedPayload(url, payload);

    const responseError = String(response?.error || '');
    const isBrokenCategoryFilter =
      /internal server error/i.test(responseError) ||
      /undefined method/i.test(responseError) ||
      /getschemecategory/i.test(responseError);

    if (isBrokenCategoryFilter) {
      console.warn(`Backend ${url} is failing.`, responseError);
    }

    console.log(`scheme-registration dropdown [type=${typeParam}] response:`, response);

    const rows = this.extractRows(response);
    console.log(`scheme-registration dropdown [type=${typeParam}] rows:`, rows);

    this.bindSelectOptions(selector, rows, {
      valueKeys: bindConfig.valueKeys || ['id', 'value', 'lookup_id', 'type_id'],
      textKeys: bindConfig.textKeys || ['display_text', 'displayText', 'name', 'text', 'label', 'description'],
      placeholderText: bindConfig.placeholderText || '--Select--'
    });

    return rows;
  }
};
