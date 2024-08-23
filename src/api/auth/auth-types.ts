export type AluminiRegistrationResponse = {
    "message": "Admin Successfully Created",
    "status_code": 200,
    "data": [],
    "success": true
}

export type VerifiedMembershipResponse = {
    message: string;
    success?: boolean;
    status_code: number; // Use the appropriate number type
    data: [
      {
        isValid: boolean;
        user: {
          EMAIL: null | string;
          GSM: string;
          MEMBERSHIP_GRADE:string;
          MEMBERSHIP_NO: string;
          POSITION_HELD: string|null;
          TITLE: string;
          // alumni_year: string;
          name: string;
          fullname:string
          email:string
        };
      }
    ];
  };
  
// {
//     "message": "Success",
//     "status_code": 200,
//     "data": [
//         {
//             "isValid": true,
//             "user": {
//                 "EMAIL": null,
//                 "GSM": "08034938923, 08105112310",
//                 "MEMBERSHIP_NO": "N006/28354",
//                 "POSITION HELD": null,
//                 "TITLE": "MRS.",
//                 "alumni_year": "2020-01-26 00:00:00",
//                 "name": "ADESOLA OLUWATOYIN OLABISI"
//             }
//         }
//     ],
//     "success": true
// }

//  "email":"dbadebayddddo@admin.com",