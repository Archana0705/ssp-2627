  // permissions.js
const permissions = {
    roles: {
            // Role ID & Role Name
        1: {
            name: 'Super Admin',
                  // Scheme Management
            canAddScheme    : true,
            canEditScheme   : true,
            canViewScheme   : true,
            canDeleteScheme : true,
            canApproveScheme: true,
            canAddSubScheme : true
        },
        2: {
            name: 'State Admin',
                  // Scheme Management
            canAddScheme    : true,
            canEditScheme   : true,
            canViewScheme   : true,
            canDeleteScheme : true,
            canApproveScheme: true,
            canAddSubScheme : true
        },
        3: {
            name: 'State User',
                  // Scheme Management
            canAddScheme    : false,
            canEditScheme   : false,
            canViewScheme   : true,
            canDeleteScheme : false,
            canApproveScheme: false
        },
        4: {
            name: 'Department State User',
                  // Scheme Management
            canAddScheme    : true,
            canEditScheme   : true,
            canViewScheme   : true,
            canDeleteScheme : true,
            canApproveScheme: false,
            canAddSubScheme : true
        },
        5: {
            name: 'Department Head',
                  // Scheme Management
            canAddScheme    : true,
            canEditScheme   : true,
            canViewScheme   : true,
            canDeleteScheme : false,
            canApproveScheme: true,
            canAddSubScheme : true
        },
        8: {
            name: 'Department User',
                  // Scheme Management
            canAddScheme    : false,
            canEditScheme   : false,
            canViewScheme   : true,
            canDeleteScheme : false,
            canApproveScheme: false
        },
        9: {
            name: 'District User',
                  // Scheme Management
            canAddScheme    : false,
            canEditScheme   : false,
            canViewScheme   : true,
            canDeleteScheme : false,
            canApproveScheme: false
        },
        11: {
            name: 'EDM User',
            canAddScheme    : false,
            canEditScheme   : false,
            canViewScheme   : false,
            canDeleteScheme : false,
            canApproveScheme: false,
            feeReports      : true
        },
            // Default role settings
        default: {
                  // Scheme Management
            canAddScheme    : false,
            canEditScheme   : false,
            canViewScheme   : true,
            canDeleteScheme : false,
            canApproveScheme: false
        }
    }
};

export default permissions;