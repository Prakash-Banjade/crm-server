export enum EApplicationStatus {
    Received_Application_At_Lopho = 'received_application_at_lopho',
    Application_In_Progress = 'application_in_progress',
    Application_On_Hold_Intake_Yet_To_Open = 'application_on_hold_intake_yet_to_open',
    Application_On_Hold_Lopho_Team = 'application_on_hold_lopho_team',
    Application_On_Hold_University = 'application_on_hold_university',

    Pending_From_Partner = 'pending_from_partner',
    Pending_From_Partner_Login_Credentials = 'pending_from_partner_login_credentials',
    Pending_From_Partner_Academic_Documents = 'pending_from_partner_academic_documents',
    Pending_From_Partner_Financial_Documents = 'pending_from_partner_financial_documents',
    Pending_From_Partner_Application_Fee_Pending = 'pending_from_partner_application_fee_pending',

    Pending_From_Lopho = 'pending_from_lopho',

    Application_Submitted_To_The_Institution = 'application_submitted_to_the_institution',
    Application_Submitted_Consent_Form_Student_Id_Required = 'application_submitted_consent_form_student_id_required',
    Application_Submitted_Under_Review = 'application_submitted_under_review',

    Rejected_By_Institution = 'rejected_by_institution',

    Conditional_Offer_Received = 'conditional_offer_received',
    Unconditional_Offer_Received = 'unconditional_offer_received',

    Funds_Pending_From_Partner = 'funds_pending_from_partner',
    Funds_On_Hold_By_The_Institution = 'funds_on_hold_by_the_institution',
    Funds_Submitted_To_The_Institution = 'funds_submitted_to_the_institution',
    Funds_Under_Assessment = 'funds_under_assessment',
    Funds_Approved = 'funds_approved',

    Rejected_On_Gte_Grounds = 'rejected_on_gte_grounds',

    Coe_Received = 'coe_received',
    Payment_Received = 'payment_received',

    Pal_Pending = 'pal_pending',
    Pal_Received = 'pal_received',

    Cas_Requested = 'cas_requested',
    Cas_Received = 'cas_received',

    I_20_Initiated = 'i_20_initiated',
    I_20_Received = 'i_20_received',

    Aip_Received = 'aip_received',

    Visa_In_Process = 'visa_in_process',
    Visa_Received = 'visa_received',
    Visa_Rejected = 'visa_rejected',

    Proposed_For_Case_Closure = 'proposed_for_case_closure',

    Case_Closed = 'case_closed',
    Case_Closed_Fraudulent_Documents_Found = 'case_closed_fraudulent_documents_found',
    Case_Closed_On_Partners_Suggestion = 'case_closed_on_partners_suggestion',
    Case_Closed_Program_Closed = 'case_closed_program_closed',
    Case_Closed_Student_Not_Qualified = 'case_closed_student_not_qualified',
    Case_Closed_Offer_Received_Student_Not_Interested_To_Pay = 'case_closed_offer_received_student_not_interested_to_pay',
    Case_Closed_Offer_Received_Student_Paid_Tuition_Fees_To_Other_Institution = 'case_closed_offer_received_student_paid_tuition_fees_to_other_institution',
    Case_Closed_Student_Not_Tagged_Under_Lopho = 'case_closed_student_not_tagged_under_lopho',
    Case_Closed_Student_Not_Enrolled = 'case_closed_student_not_enrolled',
    Case_Closed_Full_Commission_Received = 'case_closed_full_commission_received',

    Deferral_Initiated = 'deferral_initiated',
    Deferral_Completed_Refund_Request_Pending = 'deferral_completed_refund_request_pending',
    Deferral_Completed = 'deferral_completed',

    Refund_Request_Initiated = 'refund_request_initiated',

    Invoicing_Due = 'invoicing_due',
    Invoice_Sent_To_The_Institution = 'invoice_sent_to_the_institution',

    Visa_Received_Progressive_Student = 'visa_received_progressive_student',
    Visa_Received_Progressive_Student_Discontinued_Enrolment = 'visa_received_progressive_student_discontinued_enrolment',
    Visa_Received_Progressive_Student_Tuition_Fees_Not_Paid = 'visa_received_progressive_student_tuition_fees_not_paid',
}
