import env from "@/utils/data/env";

const questionnaireData = {
  flow_id: 1,
  flow_name: "payroll_services",
  supported_brands: [
    {
      form_id: env.PAYCOR_FORM_ID,
      weight: 0.7,
    },
    {
      form_id: env.PAYCHEX_FORM_ID,
      weight: 0.3,
    },
  ],
  questions: [
    {
      text: "How many employees are in your company?",
      code: "num_employees",
      step: 1,
      type: "one-selection",
      display_list_direction: "col",
      included_in_scoring: true,
      answers: [
        {
          text: "Only me",
          next_question_code: "purchase_time",
        },
        {
          text: "2-9 Employees",
          next_question_code: "purchase_time",
        },
        {
          text: "10-24 Employees",
          next_question_code: "purchase_time",
        },
        {
          text: "25-49 Employees",
          next_question_code: "purchase_time",
        },
        {
          text: "50+ Employees",
          next_question_code: "purchase_time",
        },
      ],
    },
    {
      text: "When do you need your new payroll software?",
      code: "purchase_time",
      step: 2,
      type: "one-selection",
      display_list_direction: "col",
      included_in_scoring: true,
      answers: [
        {
          text: "0-3 Months",
          next_question_code: "solution_reason",
        },
        {
          text: "3-6 Months",
          next_question_code: "solution_reason",
        },
        {
          text: "6-12 Months",
          next_question_code: "solution_reason",
        },
        {
          text: "12+ Months",
          next_question_code: "solution_reason",
          excluded_brands: [env.PAYCOR_FORM_ID],
        },
      ],
    },
    {
      text: "Why are you looking for a new payroll solution?",
      code: "solution_reason",
      step: 3,
      type: "one-selection",
      display_list_direction: "col",
      included_in_scoring: true,
      answers: [
        {
          text: "Price",
          next_question_code: "zip_code",
        },
        {
          text: "Customer Service",

          next_question_code: "zip_code",
        },
        {
          text: "Ease of Use",
          next_question_code: "zip_code",
        },
        {
          text: "Increase Productivity",
          next_question_code: "zip_code",
        },
        {
          text: "Data Accuracy",
          next_question_code: "zip_code",
        },
        {
          text: "Other",
          isOther: true,
          next_question_code: "zip_code",
        },
      ],
    },
    {
      code: "zip_code",
      step: 4,
      type: "details-question",
      display_list_direction: "col",
      subquestions: [
        {
          text: "Please enter your zip code",
          code: "zip_code",
          error: "Please enter a valid 5-digit ZIP code.",
          example: "e.g: 90210",
          maxLength: "5",
        },
      ],
      answers: [
        {
          next_question_code: "loader",
        },
      ],
      extra_info: "This will help us find relevant providers in your location.",
    },
    {
      text: "Hold on...",
      code: "loader",
      step: 5,
      type: "loader",
      display_list_direction: "col",
      answers: [
        {
          next_question_code: "email",
        },
      ],
      extra_info: "Our experts are working their magic",
    },
    {
      code: "email",
      step: 6,
      display_list_direction: "col",

      type: "form-type",
      subquestions: [
        {
          text: "What is your work email address?",
          code: "email",
          example: "e.g: abc@gmail.com",
          error: "Please enter a valid email address",
        },
      ],
      answers: [
        {
          next_question_code: "personal_and_business_info",
        },
      ],
    },
    {
      code: "personal_and_business_info",
      step: 7,
      type: "form-type",
      display_list_direction: "col",

      subquestions: [
        {
          text: "First name",
          code: "first_name",
          error: "Your first name must contain at least 2 characters",
          example: "e.g: John",
        },
        {
          text: "Last name",
          code: "last_name",
          error: "Your last name must contain at least 2 characters",
          example: "e.g: Smith",
        },
        {
          text: "What is your business name?",
          code: "company_name",
          error: "Your business name must contain at least 2 characters",
          example: "e.g: Acme Marketing",
          maxLength: "50",
        },
      ],
      answers: [
        {
          next_question_code: "phone",
        },
      ],
    },
    {
      code: "phone",
      step: 8,
      display_list_direction: "col",

      type: "form-type",
      subquestions: [
        {
          text: "What is your phone number?",
          code: "phone",
          error: "Please enter a valid phone number",
          example: "e.g: 2345678901",
          maxLength: "10",
        },
      ],
      answers: [
        {
          next_question_code: "thank_you",
        },
      ],
      extra_info:
        "This will be used for relevant providers to call you by phone.",
    },
    {
      text: "Thank you",
      code: "thank_you",
      step: 99999,
      type: "thank you",
      display_list_direction: "col",
      answers: [],
    },
  ],
};
export default questionnaireData;
