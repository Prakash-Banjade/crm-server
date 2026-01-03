export enum EApplicationPriority {
    Low = 'low',
    Medium = 'medium',
    High = 'high',
    None = 'none',
}

export enum EConversationType {
    Admin = 'admin',
    student = 'student',
}

export enum EApplicationStatus {
    // --- STAGE 1: SUBMISSION ---
    Application_In_Progress = 'application_in_progress',
    // Represents the "Action Required" bucket (combining all specific pending types)
    Pending_From_Partner = 'pending_from_partner',
    Application_Submitted_To_The_Institution = 'application_submitted_to_the_institution',

    // --- STAGE 2: ACADEMIC OUTCOME ---
    Conditional_Offer_Received = 'conditional_offer_received',
    Unconditional_Offer_Received = 'unconditional_offer_received',
    Rejected_By_Institution = 'rejected_by_institution',

    // --- STAGE 3: FINANCIAL & COMPLIANCE (GTE/Funds) ---
    Funds_Under_Assessment = 'funds_under_assessment',
    Funds_Approved = 'funds_approved',
    Rejected_On_Gte_Grounds = 'rejected_on_gte_grounds',

    // --- STAGE 4: GOVERNMENT DOCUMENTS (Country Specific) ---
    // These are the "Golden Tickets" required before a Visa application
    Coe_Received = 'coe_received', // Australia
    Pal_Received = 'pal_received', // Canada
    Cas_Received = 'cas_received', // UK
    i_20_Received = 'i_20_received', // USA

    // --- STAGE 5: VISA OUTCOME ---
    Visa_In_Process = 'visa_in_process',
    Visa_Received = 'visa_received',
    Visa_Rejected = 'visa_rejected',

    // --- STAGE 6: CLOSURE ---
    Deferral_Initiated = 'deferral_initiated',
    Refund_Request_Initiated = 'refund_request_initiated',
    Case_Closed = 'case_closed',
}