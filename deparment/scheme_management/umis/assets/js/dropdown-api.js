const DropdownAPI = {
  getApiBase() {
    return (
      (window.config && config.secureApiBase) ||
      'https://tngis.tnega.local/state_scholarship_portal_api/ssp_3/public/api'
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

  extractRows(response) {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.data)) return response.data.data;
    if (Array.isArray(response.result)) return response.result;
    if (response.result && Array.isArray(response.result.data)) return response.result.data;
    if (Array.isArray(response.departments)) return response.departments;
    if (Array.isArray(response.subDepartments)) return response.subDepartments;
    if (response.payload && Array.isArray(response.payload.data)) return response.payload.data;
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
      const text = textKeys.map((k) => row[k]).find((v) => typeof v === 'string' && v.trim());
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
  }
};
